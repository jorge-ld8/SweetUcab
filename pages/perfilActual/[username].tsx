import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import prisma from '../../lib/prisma';
import { cliente_juridico, cliente_natural, permiso, rol, usuario } from "@prisma/client"
import Router from "next/router";
import { Button, Container } from "@mui/material";
import superjson from "superjson";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const user = await prisma.usuario.findUnique({
      where: {
        u_username : String(params?.username),
      },
    });

    let c_juridico = null, c_natural = null;

    if(user.fk_cliente_juridico){
      // cliente juridico
      c_juridico = await prisma.cliente_juridico.findUnique({
        where:{
          c_id: user.fk_cliente_juridico,
        }
      })
    }
    else if(user.fk_cliente_natural){
      //cliente_natural
      c_natural = await prisma.cliente_natural.findUnique({
        where: {
          c_id: user.fk_cliente_natural,
        }
      })
    }
    const rol = await prisma.rol.findFirst({
        where: {
          r_id: 1,
        }
    });

    return {
      props: {
        user: user,
        rol: rol,
        c_juridico: superjson.parse(superjson.stringify(c_juridico)),
        c_natural: superjson.parse(superjson.stringify(c_natural)),
      }
    }
  }

  type perfilPost = {
    user: usuario
    rol: rol,
    c_juridico: cliente_juridico,
    c_natural: cliente_natural
  }
  
  const RolPost: React.FC<perfilPost> = (props) => {
    
    function onCerrarSesion(e){
      e.preventDefault();
      localStorage.clear();
      Router.push("/");
    }

    function onCarnetSweetUCAB(e){
      e.preventDefault();
    }
    
    return (
      <main>
          <div className="stylish">
            <div>
            <div>
              <h2>{props.user.u_username}</h2>
              <p><b>ID {props.user.u_id}</b></p>
              <p>Email: {props.user.u_email}</p>
              <p>Rol: {props.user.fk_rol} </p>
              {props.c_juridico ?
               (<div>
                  <p>Cliente Juridico</p>
                  <p>Puntos: {props.c_juridico.c_cantidad_puntos}</p>
               </div>)
               : 
                (props.c_natural ? 
                  (<div>
                    <p>Cliente Natural</p>
                    <p>Puntos: {props.c_natural.c_cantidad_puntos}</p>
                 </div>
                  )  
                 :
                 (<div>
                  <p>Empleado</p>
               </div>
                )
                 )
               }
            </div>
            </div>
            <div>
              <Button variant="contained" sx={{
                            bgcolor: '#E02464', width: '30%', margin:1}} onClick={onCarnetSweetUCAB}>
                              CARNET SWEET UCAB
              </Button>
            </div>
            <div>
              <Button variant="contained" sx={{
                            bgcolor: '#E02464', width: '30%', margin: 1}} onClick={onCerrarSesion}>
                              CERRAR SESION
              </Button>
            </div>
          </div>
        <style jsx>{`
          .stylish{
            text-align: center;
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