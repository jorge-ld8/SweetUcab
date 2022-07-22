import React, {useState, useEffect} from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import Page from "../components/Page";
import Crud from "../components/Crud";
import { producto } from "@prisma/client";
import superjson from "superjson";

export const getStaticProps: GetStaticProps = async () => {
    const feed = await prisma.oferta.findMany(
        {orderBy:{
            o_id: 'asc',
        },
        select:{
            o_id: true,
            o_descripcion: true,
            o_porcentaje_descuento: true,
            o_fecha_inicio: true,
            o_fecha_fin: true,
        }
        }
    );

    let feedJSON = feed.map(({o_id, o_descripcion, o_porcentaje_descuento, o_fecha_inicio, o_fecha_fin})=>{
        return {o_id: o_id,
                o_descripcion: o_descripcion,
                o_porcentaje_descuento: superjson.parse(superjson.stringify(o_porcentaje_descuento))+"%",
                o_fecha_inicio: new Date(o_fecha_inicio.setUTCHours(5)).toDateString(),
                o_fecha_fin: o_fecha_fin ? new Date(o_fecha_fin.setUTCHours(5)).toDateString() : null,
        }}
    );

    return { 
      props: { feed: feedJSON }, 
      revalidate: 10 
    } 
}

type Props<ArbType extends Object> = {
  feed: ArbType[]
}

const Blog: React.FC<Props<any>> = (props) => {
  const[state, setState] = useState("active"); //state hook

  useEffect(() => {
   //componente mounts
   return () => {
   }
 }, [state]) //effect hook

  function handleStateChange(newState){
    setState(newState);
  }

  return (
    <Page>
      <Crud headers={["ID", "Descripcion", "Porcentaje", "Fecha Inicio", "Fecha Fin"]}content={props.feed} name={'oferta'} stateChanger={handleStateChange}/>
    </Page>
  )
}

export default Blog