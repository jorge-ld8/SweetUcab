import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import prisma from '../../lib/prisma';
import { useRouter } from "next/router"
import { cliente_juridico } from "@prisma/client"

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const cliente_juridico = await prisma.cliente_juridico.findUnique({
      where: {
        c_id : Number(params?.id),
      },
    });
    return {
      props: cliente_juridico,
    }
  }

  const ClienteJuridicoPost: React.FC<cliente_juridico> = (props) => {

          const markdown = `
    ## ${props.c_razon_social}
              ** ID: ${props.c_id} **
              * RIF: ${props.c_rif}
              * Denominación Comercial: ${props.c_denom_comercial}
              * Capital: ${props.c_capital_disponible}
              * Dirección: ${props.c_direccion}
              * Dirección Fiscal Principal: ${props.c_direccion_fiscal_ppal}
              * Página Web: ${props.c_pagina_web}
              * Cantidad de puntos: ${props.c_cantidad_puntos}
              * Código de registro: ${props.c_codigo_registro}
              * Código de lugar: ${props.fk_lugar}
              * Código de lugar (fiscal): ${props.fk_lugar2}
              * Código de tienda de registro: ${props.fk_tienda}`;
    return (
      <Layout>
        <div>
            <h2>{props.c_razon_social}</h2>
            <p><b>ID {props.c_id}</b></p>
            <p>RIF: {props.c_rif}</p>
            <p>Denominación Comercial: {props.c_denom_comercial}</p>
            <p>Capital: {props.c_capital_disponible}</p>
            <p>Dirección: {props.c_direccion}</p>
            <p>Dirección Fiscal Principal: {props.c_direccion_fiscal_ppal}</p>
            <p>Página Web: {props.c_pagina_web}</p>
            <p>Cantidad de puntos: {props.c_cantidad_puntos}</p>
            <p>Código de registro: {props.c_codigo_registro}</p>
            <p>Código de lugar: {props.fk_lugar}</p>
            <p>Código de lugar (fiscal): {props.fk_lugar2}</p>
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
      </Layout>
    )
  }

  export default ClienteJuridicoPost;