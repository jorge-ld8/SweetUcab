import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import prisma from '../../lib/prisma';
import { historico_punto, permiso, rol } from "@prisma/client"
import superjson from 'superjson';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const h_punto = await prisma.historico_punto.findUnique({
        where: {
          h_id : Number(params?.id),
        },
      });
  
      let feedJSON = {
        h_id: h_punto.h_id, 
        h_valor: superjson.parse(superjson.stringify(h_punto.h_valor)), 
        h_fecha_emision: h_punto.h_fecha_emision.toDateString(), 
        h_fecha_final: h_punto.h_fecha_final ? new Date(h_punto.h_fecha_emision.setUTCHours(5)).toDateString(): null,
      }
  
      return {
        props: feedJSON,
      }
  }
  
  const RolPost: React.FC<historico_punto> = (props) => {
    return (
      <main>
        <div className="stylish">
          <h2>Punto #{props.h_id}</h2>
          <p>Valor: {props.h_valor}$</p>
          <p>Fecha Emision: {props.h_fecha_emision}</p>
          <p>Fecha Fin: {props.h_fecha_final}</p>
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
      </main>
    )
  }
  
  export default RolPost;