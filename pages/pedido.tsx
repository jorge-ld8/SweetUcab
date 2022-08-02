import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import prisma from '../lib/prisma';
import { cliente_juridico, cliente_natural, permiso, rol, usuario } from "@prisma/client"
import Router from "next/router";
import { Button, Container } from "@mui/material";
import superjson from "superjson";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const rol = await prisma.rol.findFirst({
        where: {
          r_id: 1,
        }
    });

    return {
      props: {
        rol: rol,
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
    
    function onCarnetSweetUCAB(e){
      e.preventDefault();
    }
    
    function onConsultar(e){
        e.preventDefault();
        Router.push("/pedidoConsultar");
    }

    function onModificar(e){
        e.preventDefault();
        Router.push("/pedidoModificar");
    }
    return (
      <main>
          <div className="stylish">
            <div>
              <Button variant="contained" sx={{
                            bgcolor: '#E02464', width: '30%', margin:4, marginTop: 8, fontSize: 20}} onClick={onConsultar}>
                              CONSULTAR ESTATUS PEDIDO
              </Button>
            </div>
            <div>
              <Button variant="contained" sx={{
                            bgcolor: '#E02464', width: '30%', margin:4, fontSize: 20}} onClick={onModificar}>
                              MODIFICAR ESTATUS PEDIDO                                                                                                
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