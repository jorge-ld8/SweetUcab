import React, { ReactNode } from "react";
import reactMarkdown from "react-markdown";
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../components/Layout"
import { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import Router from "next/router";
import { Formik, FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';
import { lugar, producto } from "@prisma/client";
import GridElement from "../components/GridElementmix";
import Grid from "@mui/material/Grid";
import UserProfile from "./userSession";

export const getServerSideProps: GetServerSideProps = async () => {
const productos = await prisma.$queryRaw`
select distinct p.p_id, p.p_nombre, p.p_descripcion, (p.p_precio_actual/p.p_peso) precio, pa.p_cantidad,
i.i_imagen imagen from producto p, producto_anaquel pa, imagen_producto i where pa.fk_anaquel in (1,42, 44, 45)
and p.p_id=i.fk_producto and p.p_id=pa.fk_producto and mod(i.i_id,2)<>0 order by p.p_id;`

    return {
      props: {productos}
    }
}

type Props<ArbType extends Object> = {
  productos: ArbType[]
}


const Component: React.FC<any> = (props)=>
{
    console.log(UserProfile.getProductoCarrito());
    return (
      <main>
      <h3>PICK & MIX!</h3>
            <Grid container >
              {props.productos.map((producto)=>{
                return (<GridElement prodName={producto.p_nombre} prodPrecio={producto.precio}
                  imageUrl={producto.imagen} id={producto.p_id}></GridElement>)
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