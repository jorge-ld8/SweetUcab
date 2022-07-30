import React, {useState, useEffect} from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import Crud from "../components/Crud";
import { historico_punto, producto } from "@prisma/client";
import { json } from "stream/consumers";
import superjson from "superjson";

export const getStaticProps: GetStaticProps = async () => {
    let feed = await prisma.historico_punto.findMany(
        {orderBy:{
            h_id: 'asc',
        },
        select:{
            h_id: true,
            h_valor: true,
            h_fecha_emision: true,
            h_fecha_final: true,
        }
        }
    );

    let feedJSON = feed.map(({h_id, h_valor, h_fecha_emision, h_fecha_final})=>{
        return {h_id, h_valor: superjson.parse(superjson.stringify(h_valor)), h_fecha_emision: new Date(h_fecha_emision.setUTCHours(5)).toDateString(), h_fecha_final: h_fecha_final ? new Date(h_fecha_emision.setUTCHours(5)).toDateString(): null}
    }
    );

    return { 
      props: {feed: feedJSON}, 
      revalidate: 10 
    } 
}

type Props<ArbType extends Object> = {
  feed: ArbType[]
}

const Blog: React.FC<Props<historico_punto>> = (props) => {
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
    <main>
      <Crud headers={["ID", "Valor", "Fecha_Emision", "Fecha_Final"]}content={props.feed} name={'historico_punto'} stateChanger={handleStateChange}/>
    </main>
  )
}

export default Blog