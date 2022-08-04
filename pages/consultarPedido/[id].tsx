import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import prisma from '../../lib/prisma';
import { cliente_juridico, cliente_natural, estatus, estatus_transaccion, permiso, producto, rol, transaccion_compra, usuario } from "@prisma/client"
import Router from "next/router";
import { Button, Container } from "@mui/material";
import superjson from "superjson";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const t_compra = await prisma.transaccion_compra.findFirst({
        where:{
            t_id: Number(params?.id),
        },
        select:{
          compra: {
            select:{
              fk_producto: true,
              c_precio_por_unidad: true,
              c_cantidad: true,
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

    const listaProductos = []; //la lista de productos que tiene la compra
    for(let compra of t_compra.compra){
        const prod = await prisma.producto.findUnique({
            where:{
                p_id: compra.fk_producto,
            }
        });
        listaProductos.push({producto: prod, cantidad: compra.c_cantidad, precio:compra.c_precio_por_unidad});
    }

     const estatusPedido = await prisma.estatus_transaccion.findMany({
        where: {
            fk_transaccion_compra: t_compra.t_id,
        },
        select: {
            estatus: {
              select: {
                e_nombre: true
              }
            },
            e_fecha_hora_establecida: true,
            e_fecha_fin: true, 
        },
     });


    for(let compraField in t_compra){
        t_compra[compraField] = String(t_compra[compraField])
    }

    let finalListaProd = [];
    for(let prod of listaProductos){
        finalListaProd.push(JSON.parse(JSON.stringify(prod)));
    }

    let finalListEstatus = [];
    for(let estatus of estatusPedido){
        for(let estatusProp in estatus){
            if(estatus[estatusProp] instanceof Date)
              estatus[estatusProp] = estatus[estatusProp].toDateString();
            else
              estatus[estatusProp] = superjson.parse(superjson.stringify(estatus[estatusProp]));
        }
        finalListEstatus.push(estatus);
    }

    return {
      props: {
        t_compra: t_compra,
        listaProd: finalListaProd,
        estatusP: finalListEstatus,
      },
    }
  }

  type perfilPost = {
    t_compra: transaccion_compra,
    listaProd: {producto: producto, cantidad: number, precio: number}[],
    estatusP: {e_fecha_hora_establecida: Date, e_fecha_fin: Date, estatus: estatus }[]
  }
  
  const RolPost: React.FC<any> = (props) => {
    
    console.log(props.estatusP);
    console.log(props.t_compra.t_en_linea);
    
    return (
      <main>
          <div className="stylish">
            <div>
              {props.t_compra ? 
              (
                <div>
                  <h2>Transaccion #{props.t_compra.t_id}</h2>
                  <p>{props.t_compra.t_en_linea? "COMPRA EN LINEA" : "COMPRA FÍSICA"}</p>
                  <p>Monto Total: ${props.t_compra.t_total_compra}</p>
                  <p><b> Productos Pedidos:</b></p>
                  <ul>
                    {props.listaProd.map((prod)=>{
                        return(<li>{prod.producto.p_nombre} - ${prod.precio} Cantidad: {prod.cantidad}</li>);
                    })}
                  </ul>
                  <p><b>Estatus del producto:</b></p>
                  <ul>
                    {props.estatusP.map((estatus)=>{
                        return(
                            <li>
                                <i>{estatus.estatus.e_nombre}</i>
                                <ul>
                                    <li>Inicio: {estatus.e_fecha_hora_establecida}</li>
                                    <li>Fin: {estatus.e_fecha_fin}</li>
                                </ul>
                            </li>)
                    })
                  }
                  </ul>
                </div>
              )
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
          </div>
        <style jsx>{`
        i{
          font-size: 1.4em;
          margin: .5em;
          display: inline-block;
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