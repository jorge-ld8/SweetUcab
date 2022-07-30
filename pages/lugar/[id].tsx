import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import prisma from '../../lib/prisma';
import { lugar } from "@prisma/client"

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const lugar = await prisma.lugar.findUnique({
      where: {
        l_id : Number(params?.id),
      },
    });
    return {
      props: lugar,
    }
  }
  
  const LugarPost: React.FC<lugar> = (props) => {
    return (
      <main>
        <div>
          <h2>{props.l_descripcion}</h2>
          <p>{props.l_id}</p>
          <p>{props.fk_lugar}</p>
          <p>Tipo {props.l_tipo || "Unknown type"}</p> 
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
  
  export default LugarPost;