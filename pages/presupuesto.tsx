import React, {useState, useEffect} from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import Page from "../components/Page";
import Crud from "../components/Crud";
import { producto } from "@prisma/client";
import superjson from "superjson";

export const getStaticProps: GetStaticProps = async () => {
    const feed = await prisma.presupuesto.findMany(
        {orderBy:{
            p_id: 'asc',
        },
        select: {
            p_id: true,
            p_fecha_creacion: true,
            p_total_presupuesto: true,
        }
        }
    );

    let feedJSON = feed.map(({p_id, p_fecha_creacion, p_total_presupuesto})=>{
        return {p_id: p_id,
                p_fecha_creacion: new Date(p_fecha_creacion.setUTCHours(5)).toDateString(),
                p_total_presupuesto: Number(p_total_presupuesto),
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
      <Crud headers={["ID", "Fecha", "Monto"]} content={props.feed} name={'presupuesto'} stateChanger={handleStateChange}/>
    </Page>
  )
}

export default Blog