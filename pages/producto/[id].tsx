import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import Image from "next/image";
import prisma from '../../lib/prisma';
import { imagen_producto, producto } from "@prisma/client"
import { imageConfigDefault } from "next/dist/server/image-config";

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
        <div className="stylish">
          <h2>{props.producto.p_nombre}</h2>
          <p>ID: {props.producto.p_id}</p> 
          <p>Descripcion: {props.producto.p_descripcion}</p>
          <p>Peso: {props.producto.p_peso}</p>
          <p>Precio Actual: {props.producto.p_precio_actual}</p>
          <div className="imageContainer">{props.imagen?.map((img)=><img src={img.i_imagen}/>)}</div>
        </div>
        <style jsx>{`
          .imageContainer{
            width: 80%;
          }
          img{
            max-width: 30%; 
            margin: 1em;
            display: inline-block;
          }
          .stylish{
            margin-left: .5em;
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
      </Layout>
    )
  }
  
  export default ProductoPost;