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
import GridElement from "../components/GridElement";
import Grid from "@mui/material/Grid";
import UserProfile from "./userSession";

export const getServerSideProps: GetServerSideProps = async () => {
    const productos = await prisma.producto.findMany({
      include: {
        imagen_producto: true
      }
    });
    return {
      props: {productos: productos},
    }
  }

type Props = {
    productos: producto[]
}
  

const Component: React.FC<any> = (props)=>
{
    console.log(UserProfile.getProductoCarrito());
    return (
      <main>
            <Grid container >
              {props.productos.map((producto)=>{
                return (<GridElement prodName={producto.p_nombre} prodPrecio={producto.p_precio_actual} 
                  imageUrl={producto.imagen_producto[0].i_imagen} id={producto.p_id}></GridElement>)
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