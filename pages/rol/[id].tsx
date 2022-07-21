import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import prisma from '../../lib/prisma';
import { rol } from "@prisma/client"

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const rol = await prisma.rol.findUnique({
      where: {
        r_id : Number(params?.id),
      },
    });
    return {
      props: rol,
    }
  }
  
  const RolPost: React.FC<rol> = (props) => {
    return (
      <Layout>
        <div className="stylish">
          <h2>{props.r_tipo}</h2>
          <p>{props.r_id}</p>
          <p>{props.r_descripcion}</p>
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
  
  export default RolPost;