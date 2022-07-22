import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import prisma from '../../lib/prisma';
import { permiso, rol } from "@prisma/client"

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const rol = await prisma.rol.findUnique({
      where: {
        r_id : Number(params?.id),
      },
    });

    const p_roles = await prisma.permiso_rol.findMany({
      where: {
        fk_rol: Number(params?.id),
      },
      select: {
        fk_permiso: true
      }
    })
    const mapped_p_roles = p_roles.map((value)=>Number(value.fk_permiso));

    const permisos = await prisma.permiso.findMany({
      where: {
        p_id: {in: mapped_p_roles},
      }
    })
    
    return {
      props: {rol, permisos}
    }
  }

  type RolPostProps = {
    rol: rol
    permisos: permiso[]
  }
  
  const RolPost: React.FC<RolPostProps> = (props) => {
    return (
      <Layout>
        <div className="stylish">
          <h2>{props.rol.r_tipo}</h2>
          <p>{props.rol.r_id}</p>
          <p>{props.rol.r_descripcion}</p>
          <br/>
          <p>Permisos que posee: </p>
          <ul>
            {props.permisos.map((value,index)=>{
              return (<li key={index}>{value.p_tipo}</li>);
            })}
          </ul>
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