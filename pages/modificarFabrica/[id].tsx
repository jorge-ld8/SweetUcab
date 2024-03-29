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
    const p_interno = await prisma.pedido_fabrica.findUnique({
        where:{
            p_id: Number(params?.id),
        },
        select:{
            detalle_pedido:{
                select:{
                    producto: true,
                    d_cantidad: true
                }
            },
            estatus_pedido: true,
            p_fecha_creacion: true,
            p_id: true,
        }
    });
    
    if(!p_interno){
      return  {
        props: {
          p_interno : null
        },
      }
    }

    let estado = await prisma.estatus.findMany();

    const estatusInterno = await prisma.estatus_pedido.findFirst({
      where: {
          fk_pedido_fabrica: p_interno.p_id,
          e_fecha_hora_fin: null,
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
    for(let pInterno of p_interno.detalle_pedido){
        const prod = await prisma.producto.findUnique({
            where:{
                p_id: pInterno.producto.p_id,
            }
        });
        listaProductos.push({producto: prod, cantidad: pInterno.d_cantidad});
    }


    for(let compraField in p_interno){
        p_interno[compraField] = String(p_interno[compraField])
    }

    let finalListaProd = [];
    for(let prod of listaProductos){
        finalListaProd.push(JSON.parse(JSON.stringify(prod)));
    }

    return {
      props: {
        p_interno: p_interno,
        listaProd: finalListaProd,
        estados: estado,
        estadoActual: estatusInterno.estatus.e_nombre,
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
      console.log(JSON.stringify({estado: estadoActual, transaccion: props.p_interno.p_id}));
      const data = await fetch(`/api/estatusInterno`,{method: 'POST', 
      body: JSON.stringify({estatus: estadoActual,
                            p_interno: props.p_interno.p_id,
                            cantidad: 100})
      }).then(response =>{ 
        if(response.ok)
          return response.json()
        }
      ).catch(e => console.error(e));
      console.log("DATOS: ");
      console.log(data);
      Router.push("/inventario");
    }

    
    return (
      <main>
        <div className="stylish">
        {props.p_interno ? 
        (
        <div>
          <h2>Orden de Reposicion a la Fabrica #{props.p_interno.p_id}</h2>
          <p></p>
          <p><b> Productos Pedidos:</b></p>
          <ul>
            {props.listaProd.map((prod)=>{
                return(<li>{prod.producto.p_nombre} - ${prod.producto.p_precio_actual} Cantidad: {prod.cantidad}</li>);
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