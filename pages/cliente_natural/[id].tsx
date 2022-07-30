import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import prisma from '../../lib/prisma';
import { useRouter } from "next/router"
import { cliente_natural } from "@prisma/client"

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const cliente_natural = await prisma.cliente_natural.findUnique({
      where: {
        c_id : Number(params?.id),
      },
    });
    return {
      props: cliente_natural,
    }
  }

  const ClienteNaturalPost: React.FC<cliente_natural> = (props) => {

          const markdown = `
                ## ${props.c_nombre1}
                ## ${props.c_nombre2}
                ## ${props.c_apellido1}
                ## ${props.c_apellido2}
              ** ID: ${props.c_id} **
              * RIF: ${props.c_rif}
              * Cédula ${props.c_cedula}
              * Dirección: ${props.c_direccion}
              * Cantidad de puntos: ${props.c_cantidad_puntos}
              * Código de registro: ${props.c_codigo_registro}
              * Código de lugar: ${props.fk_lugar}
              * Código de tienda de registro: ${props.fk_tienda}`;
    return (
      <main>
        <div>
            <h2>{props.c_nombre1} {props.c_nombre2} {props.c_apellido1} {props.c_apellido2}</h2>
            <p><b>ID: {props.c_id}</b></p>
            <p>RIF: {props.c_rif}</p>
            <p>Cédula: {props.c_cedula}</p>
            <p>Dirección: {props.c_direccion}</p>
            <p>Cantidad de puntos: {props.c_cantidad_puntos}</p>
            <p>Código de registro: {props.c_codigo_registro}</p>
            <p>Código de lugar: {props.fk_lugar}</p>
            <p>Código de tienda de registro: {props.fk_tienda}</p>
        </div>
        <style jsx>{`
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

  export default ClienteNaturalPost;