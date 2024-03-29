import React, {useState, useEffect} from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import Crud from "../components/Crud";
import { producto } from "@prisma/client";

export const getStaticProps: GetStaticProps = async () => {
    const feed = await prisma.producto.findMany(
        {orderBy:{
        p_id: 'asc',
        },
        select:{
            p_id: true,
            p_nombre: true,
            p_descripcion: true,
            p_peso: true,
            p_precio_actual: true,
        }
        }
    );
    return { 
      props: { feed }, 
      revalidate: 10 
    } 
}

type Props<ArbType extends Object> = {
  feed: ArbType[]
}

const Blog: React.FC<Props<producto>> = (props) => {
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
      <Crud headers={["ID", "Nombre", "Descripcion", "Peso", "Precio"]}content={props.feed} name={'producto'} stateChanger={handleStateChange}/>
    </main>
  )
}

export default Blog