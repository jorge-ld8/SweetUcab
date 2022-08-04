import React, { useState } from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import prisma from '../../lib/prisma';
import { cliente_juridico, cliente_natural, estatus, estatus_transaccion, permiso, producto, rol, transaccion_compra, usuario } from "@prisma/client"
import Router from "next/router";
import { Button, Container } from "@mui/material";
import superjson from "superjson";
import DropDownList from "../../components/Dropdownlist";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const t_compra = await prisma.transaccion_compra.findFirst({
        where:{
            t_id: Number(params?.id),
        },
        select:{
          compra: {
            select:{
              fk_producto: true,
              c_cantidad: true,
              c_precio_por_unidad: true,
            }
          },
          t_id: true,
          t_total_compra: true,
          t_en_linea: true,
        }
    });

    if(!t_compra){
      return  {
        props: {
          t_compra: null
        },
      }
    }

    let estado = await prisma.estatus.findMany();

    const estatusPedido = await prisma.estatus_transaccion.findFirst({
      where: {
          fk_transaccion_compra: t_compra.t_id,
          e_fecha_fin: null,
      },
      select: {
          estatus: {
            select: {
              e_nombre: true
            }
          },
      },
   });

    const listaProductos = []; //la lista de productos que tiene la compra
    for(let compra of t_compra.compra){
        const prod = await prisma.producto.findUnique({
            where:{
                p_id: compra.fk_producto,
            }
        });
        listaProductos.push({producto: prod, cantidad: compra.c_cantidad, precio: compra.c_precio_por_unidad});
    }


    for(let compraField in t_compra){
        t_compra[compraField] = String(t_compra[compraField])
    }

    let finalListaProd = [];
    for(let prod of listaProductos){
        finalListaProd.push(JSON.parse(JSON.stringify(prod)));
    }

    return {
      props: {
        t_compra: t_compra,
        listaProd: finalListaProd,
        estados: estado,
        estadoActual: estatusPedido.estatus.e_nombre,
      },
    }
  }

  type perfilPost = {
    t_compra: transaccion_compra,
    listaProd: {producto: producto, cantidad: number}[],
    estatusP: {e_fecha_hora_establecida: Date, e_fecha_fin: Date, estatus: estatus }[]
  }
  
  const RolPost: React.FC<any> = (props) => {
    
    const [estadoActual, setestadoActual] = useState("");

    function handleEstatusChange(e){
      e.preventDefault();
      console.log(estadoActual);
      setestadoActual(e.target.value);
    }

    async function handleSubmit(e){
      e.preventDefault();
      console.log(JSON.stringify({estado: estadoActual, transaccion: props.t_compra.t_id}));
      const data = await fetch(`/api/estatus`,{method: 'POST', 
      body: JSON.stringify({estatus: estadoActual,
                            transaccion: props.t_compra.t_id})
      }).then(response =>{ 
        if(response.ok)
          return response.json()
        }
      ).catch(e => console.error(e));
      console.log("DATOS: ");
      console.log(data);
      Router.push("/pedido");
    }

    
    return (
      <main>
        <div className="stylish">
        {props.t_compra ? 
        (
        <div>
          <h2>Transaccion #{props.t_compra.t_id}</h2>
          <p>{props.t_compra.t_en_linea ? "COMPRA EN LINEA" : "COMPRA FÍSICA"}</p>
          <p>Monto Total: ${props.t_compra.t_total_compra}</p>
          <p><b> Productos Pedidos:</b></p>
          <ul>
            {props.listaProd.map((prod)=>{
                return(<li>{prod.producto.p_nombre} - ${prod.precio} Cantidad: {prod.cantidad}</li>);
            })}
          </ul>
          <p><b>Estatus Actual: {props.estadoActual}</b></p>
          <form id="theForm" onSubmit={handleSubmit}>
            <label htmlFor="relacion">Nuevo Estatus:</label>
            <DropDownList content={props.estados} attValueName={"e_nombre"} objType={"estatus"} name={"relacion"} value={estadoActual} onChange={handleEstatusChange}/>
            <div>
              <Button type={"submit"} variant="contained" color={"success"} 
               sx={{marginTop: 3}}
                disabled={estadoActual === props.estadoActual || estadoActual === "" || props.estadoActual === "Entregado"}>Modificar Estatus</Button>
            </div>
          </form>
        </div>)
        :
        (<div>
          <br />
          <p>No se encontró el pedido solicitado en la base de datos. Intente nuevamente</p>
          <Button type={"submit"} variant="contained"  sx={{
                  bgcolor: '#E02464', 
              }} onClick={()=>{Router.back()}}>Regresar</Button>
        </div>)
        }
        </div>
        <style jsx>{`
          #theForm{
            padding: 0;
            margin: 0;
          }
          
          div button{
            margin-top: 1em;
          }

          .stylish{
            text-align: center;
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
            padding: 1rem 2rem;
          }
  
          button + button {
            margin-left: 1rem;
          }
        `}</style>
      </main>
    )
  }
  
  export default RolPost;