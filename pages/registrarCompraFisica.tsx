import { useState } from "react";
import React, { ReactNode } from "react";
// import "./styles.css";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { GetStaticProps } from "next";
import { metodo_pago_cliente, pago, producto, tienda, transaccion_compra, usuario } from "@prisma/client";
import { Button, Container, FormControl, InputLabel, NativeSelect } from "@mui/material";
import { Box } from "@mui/system";
import GridElement from "../components/GridElement";
import Router from "next/router";
import superjson from "superjson";
import DropDownList from "../components/Dropdownlist";

export const getStaticProps: GetStaticProps = async () => {
    const feed = await prisma.producto.findMany(
        {
        orderBy:{
         p_id: 'asc',
         },
         include:{
            imagen_producto: true,
         }
        });
        let ultimoPunto = await prisma.historico_punto.findFirst({
            where:{
                h_fecha_final: null
            },
        });
        let tiendas = await prisma.tienda.findMany({});
        let usuarios = await prisma.usuario.findMany({});

    return { 
      props: { feed: feed, 
               ultimoPuntoValor: superjson.parse(superjson.stringify(ultimoPunto.h_valor)),
               tiendas: tiendas, 
               usuarios: usuarios},
      revalidate: 10 
    } 
}

type ProductoProps = {
    productos: producto[],
    ultimoPuntoValor: number
    metodosPago: metodo_pago_cliente[]
    feed: any
    tiendas: tienda[]
    usuarios: usuario[]
}

const Blog: React.FC<ProductoProps> = (props) => {
  const [list, setList] = useState([]);
  const [value, setValue] = useState(null);
  const [currCantidad, setCantidad] = useState(0);
  const [cliente, setCliente] = useState("");
  const [clienteID, setClienteID] = useState("");
  const [formVal1, setformVal1] = useState({tipo:'', monto: 0});
  const [formVal2, setformVal2] = useState({tipo:'', monto: 0});
  const [formVal3, setformVal3] = useState({tipo:'', monto: 0});
  const [puntoVal, setPuntoVal] = useState(0); 
  const [tienda, setTienda] = useState(""); 

  const addToList = async () => {
    let tempArr = list;
    const sumaTotalInventario = await fetch(`/api/tienda/${tienda}/${value.p_id}`, {method: 'POST',
    body: JSON.stringify({
        nombreTienda: tienda 
    })}).then(response =>{ 
        if(response.ok)
          return response.json()
        }
      ).catch(e => console.error(e));
    
    console.log(sumaTotalInventario);
    if(sumaTotalInventario){
        for(let cantidadInv of sumaTotalInventario.cantidad){
            if(Number(cantidadInv) >= currCantidad){
                tempArr.push([value, currCantidad]);
                break
            }
        }
    }
    setCantidad(0);
    setList(tempArr);
    setValue(null);
  };

  function handleChangeCantidad(e){
    e.preventDefault();
    setCantidad(+e.target.value);
  }

  function handleChangeCliente(e){
    e.preventDefault();
    setCliente(e.target.value)   
  }

  function handleChangeIDCliente(e){
    e.preventDefault();
    setClienteID(e.target.value);
  }

  function handleChangeTienda(e){
    e.preventDefault();
    setTienda(e.target.value);
  }

function ComboBox() {
    const defaultProps = {
        getOptionLabel: (option: producto) => option.p_nombre,
    };
    return (
      <Autocomplete
        disablePortal
        {...defaultProps}
        id="combo-box-demo"
        options={props.feed}
        onChange={(event, newInputValue) => {
            setValue(newInputValue);
        }}
        sx={{width:300, marginLeft: 'auto', marginRight: 'auto', marginBottom: 2}}
        renderOption={(props, option) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                <img loading="lazy" width={20} src={option.imagen_producto[0].i_imagen} alt=""/>
                {option.p_nombre}
            </Box>
        )
        }
        value={value} 
        renderInput={(params) => <TextField {...params} label="Producto" />}
      />
    );
  }



  const deleteItem = (index) => {
    let temp = list.filter((item, i) => i !== index);
    setList(temp);
  };

//   PARTE PAGOS
const metodosPago = ["zelle", "pagomovil", "efectivo", "tarjeta", "paypal", "cheque"];

// finalizar el registro del pago
async function handleSubmitPago(e) {
    e.preventDefault();
    //registrar pago
    //caso 1==2
    if(formVal1.tipo && formVal2.tipo && formVal1.tipo === formVal2.tipo){
        formVal1.monto += formVal2.monto
        formVal2.tipo = "";
        formVal2.monto = 0;
    }
    //caso 1==3
    if(formVal1.tipo && formVal3.tipo && formVal1.tipo === formVal3.tipo){
        formVal1.monto += formVal3.monto
        formVal3.tipo = "";
        formVal3.monto = 0;
    }
    //caso 2==3
    if(formVal1.tipo && formVal2.tipo && formVal2.tipo === formVal3.tipo){
        formVal2.monto += formVal3.monto
        formVal3.tipo = "";
        formVal3.monto = 0;
    }

    let idTienda;
    for(let t of props.tiendas){
        if(t.t_nombre === tienda){
            idTienda = t.t_id; 
        }
    }
    
    let username="admin";
    if(cliente === "cliente_juridico"){
        for(let usuario of props.usuarios){
            if(usuario.fk_cliente_juridico === Number(clienteID)){
                username = usuario.u_username;
            }
        }
    }
    else if (cliente === "cliente_natural"){
        for(let usuario of props.usuarios){
            if(usuario.fk_cliente_natural === Number(clienteID)){
                username = usuario.u_username;
            }
        }
    }
    //mandar pots request al backend de pago
    const transaccionCompra: transaccion_compra = await fetch(`/api/pago`,{method: 'POST',         
    body: JSON.stringify({metodos: [formVal1, formVal2, formVal3],
                          puntoVal: String(puntoVal),
                          carrito: list,
                          tienda: idTienda,
                          username: username,
                          en_linea: false })
    }).then(response =>{ 
      if(response.ok)
        return response.json()
      }
    ).catch(e => console.error(e));
    console.log(transaccionCompra);
    alert(`PAGO EXITOSO - SU PEDIDO ES EL #${transaccionCompra.t_id}`);
    //registrar comprar
    Router.back();
}

let montoTotal = 0; //monto total de la compra 
for(let prod of list){
  montoTotal += prod[1] * prod[0].p_precio_actual;
}
let montoRestante = montoTotal - formVal1.monto - formVal2.monto - formVal3.monto - puntoVal * props.ultimoPuntoValor;

function handleChangeMonto1(e){
    e.preventDefault(); 
    let valor = +e.target.value;
    setformVal1({monto: (valor < 0) ? 0 : +valor.toFixed(2), tipo: formVal1.tipo})
}

function handleMovementMonto1(e){
    e.preventDefault();
    if(montoRestante < 0){
        let valor = montoTotal - formVal2.monto - formVal3.monto - puntoVal * props.ultimoPuntoValor;
        setformVal1({monto: (valor < 0) ? 0 : Number(valor.toFixed(2)), tipo: formVal1.tipo})
    }
}
function handleChangeMonto2(e){
    e.preventDefault();
    let valor = +e.target.value;
    setformVal2({monto: (valor < 0) ? 0 : Number(valor.toFixed(2)), tipo: formVal2.tipo})
}

function handleMovementMonto2(e){
    e.preventDefault();
    if(montoRestante < 0){
        let valor = montoTotal - formVal1.monto - formVal3.monto - puntoVal * props.ultimoPuntoValor;
        setformVal2({monto: (valor < 0) ? 0 : Number(valor.toFixed(2)), tipo: formVal2.tipo})
    }
}

function handleChangeMonto3(e){
    e.preventDefault();
    let valor = +e.target.value;
    setformVal3({monto: (valor < 0) ? 0 : Number(valor.toFixed(2)), tipo: formVal3.tipo})
}

function handleMovementMonto3(e){
    e.preventDefault();
    if(montoRestante < 0){
        let valor = montoTotal - formVal1.monto - formVal2.monto - puntoVal * props.ultimoPuntoValor;
        setformVal3({monto: (valor < 0) ? 0 : Number(valor.toFixed(2)), tipo: formVal3.tipo})
    }
}

function handleChangeTipo1(e){
    e.preventDefault();
    let valor = e.target.value;
    setformVal1({monto: (valor) ? +formVal1.monto : 0, tipo: e.target.value})
}

function handleChangeTipo2(e){
    e.preventDefault();
    let valor = e.target.value;
    setformVal2({monto: (valor) ? +formVal2.monto : 0, tipo: e.target.value})
}

function handleChangeTipo3(e){
    e.preventDefault();
    let valor = e.target.value;
    setformVal3({monto: (valor) ? +formVal3.monto : 0, tipo: e.target.value})
}

function handleChangePunto(e){
    e.preventDefault();
    setPuntoVal(+e.target.value);
}

function handleMovementPunto(e){
    e.preventDefault();
    let res
    if(montoRestante < 0){
        let valor = montoTotal - formVal1.monto - formVal2.monto - formVal3.monto;
        setPuntoVal((res = Number((valor / props.ultimoPuntoValor).toFixed(5))) > 0 ?  res : 0);
    }
}

//   PARTE PAGOS
  return (
    <div className="App">
        <div className="stylish">
            <h2>REGISTRO COMPRA FISICA</h2>
            <div>
                <label htmlFor="relacion">Seleccione la tienda: </label>
                <DropDownList content={props.tiendas} attValueName={"t_nombre"} objType={"tienda"} name={"relacion"} onChange={handleChangeTienda} value={tienda}/>
            </div>
            <form action="" onSubmit={(e)=>{e.preventDefault()}}>
                <ComboBox/>
                <TextField type="number" value={currCantidad} onChange={handleChangeCantidad} helperText="Cantidad"></TextField>
                <br />
                <button onClick={addToList} disabled={!(currCantidad>0)}> Click to Add </button>
            </form>
                {list.length > 0 &&
                  list.map((item) => { return(<div> 
                    <GridElement imageUrl={item[0].imagen_producto[0].i_imagen} cantidad={item[1]} id={item[0].p_id} 
                       prodName={item[0].p_nombre} prodPrecio={item[0].p_precio_actual} maxWidth={2000}></GridElement>
                  </div> )})
                }
            <p>MONTO TOTAL: ${montoTotal}</p>
            <br />
            <br />
            <hr />
            <div>
                <h2>REGISTRO DE DATOS DE LA COMPRA</h2>
            </div>

            <fieldset name="cliente" onChange={handleChangeCliente}>
                <legend>Elija que tipo de cliente es</legend>
                    <input type="radio" id="cliente_juridico" name="cliente" value={"cliente_juridico"}/>
                    <label htmlFor="cliente_juridico">Cliente Juridico</label> <br/>
                    <input type="radio" id="cliente_natural" name="cliente" value={"cliente_natural"}/>
                    <label htmlFor="cliente_natural">Cliente Natural</label>
            </fieldset>
            <div>
                {cliente === "cliente_juridico" ? 
                        (<TextField helperText="Introduzca RIF" value={clienteID} onChange={handleChangeIDCliente}></TextField>)
                        :
                        (<TextField helperText="Introduzca Cedula" value={clienteID} onChange={handleChangeIDCliente}></TextField>)     
                    } 
            </div>
            <Container sx={{bgcolor: '#FEE2E6', borderRadius: 5, marginRight: 10}} className={"pagoElement"}>
                    <h4>Pago</h4>
                    <div>
                        <FormControl>
                            <InputLabel variant="standard" htmlFor="metodo_pago_1">
                                Metodo 1
                            </InputLabel>   
                            {/* Metodo Pago 1*/}
                            <NativeSelect onChange={handleChangeTipo1} 
                                
                                value={formVal1.tipo}
                                inputProps={{
                                    name: "metodo_pago_1",
                                    id: "metodo_pago_1"
                                }}
                                sx={{bgcolor: 'white', borderRadius: 1}}
                                >
                                <option value={""}>N/A</option>
                                {metodosPago.map((value)=>{
                                    return (<option value={value}>{value.toLowerCase()}</option>)
                                })}
                            </NativeSelect>
                        </FormControl>
                        {/* Monto 1*/}
                        <FormControl sx={{marginLeft: 5}} > 
                            <InputLabel variant="standard" htmlFor="monto1">
                                Monto 1
                            </InputLabel>
                            <TextField sx={{bgcolor: 'white', borderRadius: 1, width: 150, paddingLeft: 1}}
                            id="monto1" label="monto1" variant="standard" type="number"  onMouseLeave={handleMovementMonto1}
                            value={formVal1.monto} onChange={handleChangeMonto1}
                            disabled={!formVal1.tipo}
                            error={formVal1.monto < 0 || formVal1.monto > montoTotal}
                            />
                            
                        </FormControl>
                        
                    </div>
                    <div>
                        <FormControl margin="dense">
                            <InputLabel variant="standard" htmlFor="metodo_pago_2">
                                Metodo 2
                            </InputLabel>
                            <NativeSelect 
                                disabled={ formVal1.monto < 0 || formVal1.monto >= montoTotal || montoRestante + formVal2.monto <= 0}
                                onChange={handleChangeTipo2} 
                                value={formVal2.tipo}
                                inputProps={{
                                    name: "metodo_pago_2",
                                    id: "metodo_pago_2"
                                }}
                                sx={{bgcolor: 'white', borderRadius: 1}}
                                >
                                <option value={""}>N/A</option>
                                {metodosPago.map((value)=>{
                                    return (<option value={value}>{value.toLowerCase()}</option>)
                                })}
                            </NativeSelect>
                        </FormControl>
                        <FormControl sx={{marginLeft: 5, marginTop: 1}} > {/* Monto 2*/}
                            <InputLabel variant="standard" htmlFor="monto2">
                                Monto 2
                            </InputLabel>
                            <TextField sx={{bgcolor: 'white', borderRadius: 1, width: 150, paddingLeft: 1}}
                            id="monto2" label="monto2" variant="standard" type="number" value={formVal2.monto} 
                            disabled={!formVal2.tipo   || montoRestante + formVal2.monto <= 0}
                            onChange={handleChangeMonto2} 
                            onMouseLeave={handleMovementMonto2}
                            error={formVal2.monto < 0 || formVal2.monto > montoTotal - formVal1.monto}
                            />
                        </FormControl>
                    </div>
                    <div>
                        <FormControl margin="dense">
                            <InputLabel variant="standard" htmlFor="metodo_pago_3">
                                Metodo 3
                            </InputLabel>
                             {/* Metodo de pago 3*/}
                            <NativeSelect
                                disabled={formVal2.monto >= montoTotal - formVal1.monto  || formVal1.monto < 0 || formVal1.monto > montoTotal
                                           || formVal2.monto < 0 || formVal2.monto > montoTotal
                                          || montoRestante + formVal3.monto <= 0 }
                                onChange={handleChangeTipo3} 
                                value={formVal3.tipo}
                                inputProps={{
                                    name: "metodo_pago_3",
                                    id: "metodo_pago_3"
                                }}
                                sx={{bgcolor: 'white', borderRadius: 1}}
                                >
                                <option value={""}>N/A</option>
                                {metodosPago.map((value)=>{
                                    return (<option value={value}>{value.toLowerCase()}</option>)
                                })}
                            </NativeSelect>
                        </FormControl>
                        <FormControl sx={{marginLeft: 5, marginTop: 1}} > {/* Monto 3*/}
                            <InputLabel variant="standard" htmlFor="monto3">
                                Monto 2
                            </InputLabel>
                            <TextField 
                            disabled={  !formVal3.tipo || montoRestante + formVal3.monto <= 0 || 
                                 formVal1.monto < 0
                                  || formVal2.monto < 0}
                            sx={{bgcolor: 'white', borderRadius: 1, width: 150, paddingLeft: 1}}
                            id="monto3" label="monto3" variant="standard" type="number"
                            value={formVal3.monto}
                            onChange={handleChangeMonto3} 
                            onMouseLeave={handleMovementMonto3}
                            error={formVal3.monto < 0 || formVal3.monto > montoTotal}
                            />
                        </FormControl>
                    </div>
                    <div>
                        {/* Monto Puntos */}
                        <FormControl sx={{marginLeft: 5, marginTop: 1}} >
                                <InputLabel variant="standard" htmlFor="cantidadPuntos">
                                    Puntos
                                </InputLabel>
                                <TextField sx={{bgcolor: 'white', borderRadius: 1, paddingLeft: 1}}
                                id="cantidadPuntos" label="puntos" variant="standard" type="number"
                                value={puntoVal}
                                onChange={handleChangePunto} 
                                disabled={ montoRestante + Number(props.ultimoPuntoValor)*puntoVal <= 0}
                                onMouseLeave={handleMovementPunto}
                                helperText={`= $${(Number(props.ultimoPuntoValor) * puntoVal).toFixed(2)}`}/>
                        </FormControl>
                    </div>
                    <br />
                </Container>
                <div id="pago">
                <Button variant="contained" id="pago" sx={{
                    bgcolor: '#E02464',
                }} type ="submit" onClick={handleSubmitPago} disabled={Math.round(montoRestante) !== 0 || list.length === 0}>
                    REGISTRAR COMPRA
                </Button>
            </div>         
      </div>
      <style jsx>{`
                  .pagoElement{
                max-height: 70vh;
            }

           #pago{
             margin: 1em;
           }

           input{ 
            width: 4.5em;
           }

          img{
            max-width: 50%;
            display: inline-block;
          }

          .page {
            background: white;
            padding: 2rem;
          }
  
          .actions {
            margin-top: 2rem;
          }
  
          button {
            background: #ececec;
            border: 0;
            border-radius: 0.125rem;
            margin-top: .5em;
            padding: 1rem 2rem;
          }
            div{
                margin-top: 1em;
                margin-bottom: 0.8em;
            }
            fieldset{
                display: inline;
            }
            form{
                padding: 0;
                margin: 0;
                margin-top: 2em;
            }
            .stylish{
                text-align: center;
            }

            .actions {
                margin-top: 2rem;
            }

            button {
                background: #ececec;
                border: 0;
                border-radius: 0.125rem;
                padding: 1rem 2rem;
                margin-top: .4em;
            }

            button + button {
                margin-left: 1rem;
            }
      `}
      </style>
    </div>
  );
} 

export default Blog;
