import React, { useEffect, useState } from "react"
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import Image from "next/image";
import prisma from '../lib/prisma';
import { historico_punto, imagen_producto, producto } from "@prisma/client"
import { imageConfigDefault } from "next/dist/server/image-config";
import Button from "@mui/material/Button";
import * as Yup from 'yup';
import { Formik, FormikProvider, useFormik, validateYupSchema } from "formik";
import ErrorMessage from "../components/ErrorMessage";
import { Container, FormControl, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, NativeSelect, styled, TextField } from "@mui/material";
import UserProfile from "./userSession";
import Router from "next/router";
import { GetStaticProps } from "next";
import { Delete } from "@mui/icons-material";
import CarritoIndex from "../components/CarritoIndex";
import superjson from "superjson";

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
    let productos = await prisma.producto.findMany();
    let ultimoPunto = await prisma.historico_punto.findFirst({
        where:{
            h_fecha_final: null
        },
    });
    return{
        //   props: {producto, imagen}
        props: { productos, ultimoPuntoValor: superjson.parse(superjson.stringify(ultimoPunto.h_valor)) }
    }
}

type ProductoProps = {
    productos: producto[],
    ultimoPuntoValor: number
}

const ProductoPost: React.FC<ProductoProps> = (props) => {
    const [carrito, setCarrito] = useState([]);
    const [puntos, setPuntos] = useState("0");
    const [formVal1, setformVal1] = useState({tipo:'', monto: 0});
    const [formVal2, setformVal2] = useState({tipo:'', monto: 0});
    const [formVal3, setformVal3] = useState({tipo:'', monto: 0});
    const [puntoVal, setPuntoVal] = useState(0); 

    let cantPuntos; 
    useEffect(() => {
        setPuntos(window.localStorage.getItem("puntos"));
    }, [])
    
    function handleStateChange(newState){
        setCarrito(newState);
    }
    
    let monto1;

    const formik = useFormik({
        initialValues: {
            cantidad: 0
        },
        validationSchema: Yup.object(
            {
                cantidad: Yup.number().min(1, "Seleccione una cantidad válida").required("Coloque una cantidad si desea comprar")
            }
        ),
        onSubmit: values => { console.log(values); },
    });
    async function handleSubmit(e) {
        e.preventDefault();
        //registrar pago
        let username = JSON.parse(window.localStorage.getItem("username"));
        const pago = await fetch(`/api/pago`,{method: 'POST',         
        body: JSON.stringify({metodos: [formVal1, formVal2, formVal3],
                              puntoVal: puntoVal,
                              carrito: carrito,
                              tienda: 1,
                              username: username,
                              en_linea: true })
        }).then(response =>{ 
          if(response.ok)
            return response.json()
          }
        ).catch(e => console.error(e));
        console.log(pago);
        alert("PAGO EXITOSO");
        // window.localStorage.setItem("carrito", JSON.stringify([]));
        //registrar comprar
        Router.back();
    }

    const metodosPago: string[] = ["cheque", "efectivo", "pagomovil", "paypal", "punto", "tarjeta", "zelle"];

    let montoTotal = 0; //monto total de la compra 
    for(let prod of carrito){
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
    console.log(`Monto Restante: ${montoRestante}`);
    
    return (
        <main>
            <div className="stylish">
                <Container>
                    <h2>  CARRITO DE COMRAS </h2>
                    <CarritoIndex handleStateChange={handleStateChange} carrito={carrito}></CarritoIndex>
                    <div id="pago">
                        <Button variant="contained" id="pago" sx={{
                            bgcolor: '#E02464',
                        }} onClick={handleSubmit}
                        disabled={puntoVal>cantPuntos || Math.round(montoRestante) !== 0}>
                            PAGAR
                        </Button>
                    </div>
                </Container>
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
                    <br />
                    <div>Cantidad puntos: {puntos}</div>
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
                                error={puntoVal > cantPuntos}
                                helperText={`= $${(Number(props.ultimoPuntoValor) * puntoVal).toFixed(2)}`}/>
                        </FormControl>
                    </div>
                    <br />
                </Container>
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

           .stylish{
             display: grid;
             grid-template-columns: 2fr 1fr;
             row-gap: 1.5em;
             column-gap: 0;
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
        `}</style>
        </main>
    )
}

export default ProductoPost;