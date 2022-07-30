import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import prisma from '../../lib/prisma';
import { oferta, permiso, producto, rol } from "@prisma/client"
import superjson from "superjson";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const ppto = await prisma.presupuesto.findUnique({
      where: {
        p_id : Number(params?.id),
      },
    });

    let cNatural = null, cJuridico = null;

    if(ppto.fk_cliente_juridico){ //cliente juridico
        cJuridico = await prisma.cliente_juridico.findUnique({
            where: {
                c_id: ppto.fk_cliente_juridico
            },
        })
    }
    else if(ppto.fk_cliente_natural){
        cNatural = await prisma.cliente_natural.findUnique({
            where: {
                c_id: ppto.fk_cliente_natural
            },
        })
    }

    let productos = [];
    //buscar en presupuesto_producto q tengan fk_presupuesto = actual
    let p_prods = await prisma.producto_presupuesto.findMany({
        where: {
            fk_presupuesto: Number(params?.id)
        },
    })

    for(let producto of p_prods){
        let prodActual = await prisma.producto.findUnique({
            where: {
                p_id: producto.fk_producto
            }
        }) 
        productos.push(prodActual);
    }
    //    si tiene la fk igualbuscar producto con esa fk, añadir a lista

    let feedJSON = {p_id: ppto.p_id,
                p_fecha_creacion: new Date(ppto.p_fecha_creacion.setUTCHours(5)).toDateString(),
                p_total_presupuesto: superjson.parse(superjson.stringify(ppto.p_total_presupuesto)),
                fk_cliente_juridico: cJuridico,
                fk_cliente_natural: cNatural
    };


    return {
      props: {ppto: feedJSON, productos: productos}
    }
  }

  
  const OfertaPost: React.FC<any> = (props) => {
    return (
      <main>
        <div className="stylish">
          <h2>Presupuesto #{props.ppto.p_id}</h2>
          <h4>{props.ppto.p_fecha_creacion}</h4>
          <p>Total: {props.ppto.p_total_presupuesto + "$"}</p>
          {(props.ppto.fk_cliente_juridico) ?
           <p>Cliente Juridico: {props.ppto.fk_cliente_juridico.c_rif}</p>
           : 
           <p>Cliente Natural: {props.ppto.fk_cliente_natural.c_nombre1 +" "+ props.ppto.fk_cliente_natural.c_apellido1}</p>
          }
          <p>Productos: </p>
          <ul>
            {props.productos.map((producto)=>{
                return (<li>{producto.p_nombre}</li>);
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
      </main>
    )
  }
  
  export default OfertaPost;