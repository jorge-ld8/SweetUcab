import React, { ReactNode } from "react";
import { GetServerSideProps } from "next"
import { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import Router from "next/router";
import { lugar, producto } from "@prisma/client";
import GridElement from "../components/GridElement";
import Grid from "@mui/material/Grid";
import UserProfile from "./userSession";

export const getServerSideProps: GetServerSideProps = async () => {
    const listaProductosAnaqueles = await prisma.producto_anaquel.findMany({
      where:{   //PARA REBAJAR EL INVENTARIO SOLO CAMBIAR EL FIND POR UN UPDATE
                  anaquel:{
                      zona_pasillo:{
                          pasillo:{
                              almacen:{
                                  tienda:{
                                      t_id: 1,
                                  }
                              }
                          }
                      }
                  }
              },
        select:{ 
          producto:{
              include: {
                imagen_producto: true,
              }
          }
        },
        distinct: ['fk_producto'],
      });

    return {
      props: {productos: listaProductosAnaqueles}
    }
  }

const Component: React.FC<any> = (props)=>
{
   console.log(`Cantidad de productos: ${props.productos.length}`);
    return (
      <main>
            <Grid container >
              {props.productos.map((producto)=>{
                return (<GridElement prodName={producto.producto.p_nombre} prodPrecio={producto.producto.p_precio_actual} 
                  imageUrl={producto.producto.imagen_producto[0].i_imagen} id={producto.producto.p_id}></GridElement>)
              })}
            </Grid>
          <style jsx>{`
            .page {
              background: white;
              padding: 2rem;
            }
    
            .actions {
              margin-top: 2rem;
            }
    
            Button {
              background: #ececec;
              border: 0;
              border-radius: 0.125rem;
              padding: 1rem 2rem;
            }
    
            button + button {
              margin-left: 1rem;
            }
  
            form div{
              margin: .5em;
            }
          `}</style>
          </main>
      )
};

export default Component;