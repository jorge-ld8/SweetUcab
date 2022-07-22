import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import prisma from '../../lib/prisma';
import { oferta, permiso, producto, rol } from "@prisma/client"
import superjson from "superjson";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const oferta = await prisma.oferta.findUnique({
      where: {
        o_id : Number(params?.id),
      },
    });

    const producto = await prisma.producto.findUnique({
        where: {
            p_id: oferta.fk_producto,
        },
        select: {
            p_nombre: true,
        }
    })

    let feedJSON = {o_id: oferta.o_id,
                o_descripcion: oferta.o_descripcion,
                o_porcentaje_descuento: superjson.parse(superjson.stringify(oferta.o_porcentaje_descuento))+"%",
                o_fecha_inicio: new Date(oferta.o_fecha_inicio.setUTCHours(5)).toDateString(),
                o_fecha_fin: oferta.o_fecha_fin ? new Date(oferta.o_fecha_fin.setUTCHours(5)).toDateString() : null,
    };


    return {
      props: {oferta: feedJSON, producto: producto}
    }
  }

  type OfertaPostProps = {
    oferta: oferta
    producto: producto 
  }
  
  const OfertaPost: React.FC<OfertaPostProps> = (props) => {
    return (
      <Layout>
        <div className="stylish">
          <h2>{props.oferta.o_descripcion}</h2>
          <h4>{props.oferta.o_porcentaje_descuento}</h4>
          <p>Fecha Inicio: {props.oferta.o_fecha_inicio}</p>
          <p>Fecha Fin: {props.oferta.o_fecha_fin}</p>
          <p>Producto: {props.producto.p_nombre}</p>
        </div>
        <style jsx>{`
          
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
  
  export default OfertaPost;