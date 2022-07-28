import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import Image from "next/image";
import prisma from '../../lib/prisma';
import { imagen_producto, producto } from "@prisma/client"
import { imageConfigDefault } from "next/dist/server/image-config";
import Button from "@mui/material/Button";
import Page from "../../components/Page";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const producto = await prisma.producto.findUnique({
      where: {
        p_id : Number(params?.id),
      },
    });
    const imagen = await prisma.imagen_producto.findMany({
      where: {
        fk_producto: Number(params?.id)
      }
    })
    return {
      props: {producto, imagen}
    }
  }

  type ProductoProps = {
    producto: producto,
    imagen: imagen_producto[]
  }
  
  const ProductoPost: React.FC<ProductoProps>= (props) => {
    return (
      <Layout>
        <Page>
        <div className="stylish">
          <div className="imagen">{<img src={props.imagen[0].i_imagen}/>}</div>
          <h2 className="nombre">{props.producto.p_nombre}</h2>
          <div className="precio">{props.producto.p_precio_actual}$</div>
          <div className="descripcion">{props.producto.p_descripcion}</div>
          <div className="cantidad">Cantidad: </div>
          <div className="btnCarrito"><Button>Añadir al carrito</Button></div>
        </div>
        <style jsx>{`
           .stylish{
             display: grid;
             grid-template-areas:
                    "imagen nombre"
                    "imagen precio"
                    "imagen descripcion"
                    "imagen cantidad"
                    "imagen btnCarrito";
             grid-template-columns: 1fr 1fr;
             row-gap: 1em;
             column-gap: 0;
           }

           .imagen{
             grid-area: imagen;
           }

           .nombre{
             grid-area: nombre;
           }

           .precio{
            grid-area: precio;
           }

           .descripcion{
            grid-area: descripcion;
           }

           .btnCarrito{
            grid-area: btnCarrito;
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
            padding: 1rem 2rem;
          }
  
          button + button {
            margin-left: 1rem;
          }
        `}</style>
        </Page>
      </Layout>
    )
  }
  
  export default ProductoPost;