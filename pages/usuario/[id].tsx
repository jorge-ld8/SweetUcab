import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import prisma from '../../lib/prisma';
import { useRouter } from "next/router"
import { usuario } from "@prisma/client"

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const usuario = await prisma.usuario.findUnique({
      where: {
        u_id : Number(params?.id),
      },
    });
    return {
      props: usuario,
    }
  }

  const UsuarioPost: React.FC<usuario> = (props) => {
    const markdown = `
    ## ${props.u_username}
    ** ID: ${props.u_id} **
    * Email: ${props.u_email}
    * Rol: ${props.fk_rol}`;
    return (
      <Layout>
        <div>
            <h2>{props.u_username}</h2>
            <p><b>ID {props.u_id}</b></p>
            <p>Email: {props.u_email}</p>
            <p>Rol: {props.fk_rol}</p>
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
  
  export default UsuarioPost;