import React, {useState, useEffect} from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import Page from "../components/Page";
import Crud from "../components/Crud";
import { rol } from "@prisma/client";

export const getStaticProps: GetStaticProps = async () => {
    const feed = await prisma.rol.findMany(
    {orderBy:{
      r_id: 'asc',
    },
    select:{
        r_id: true,
        r_tipo: true,
        r_descripcion: true
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

const Blog: React.FC<Props<rol>> = (props) => {
  const navElements = [{link:"#", title:"Link 1"},
  {link:"#", title:"Link 2"},
  {link:"#", title:"Link 3"}];

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
    <Page navElements={navElements}>
      <Crud headers={["ID", "Tipo", "Descripcion"]}content={props.feed} name={'rol'} stateChanger={handleStateChange}/>
    </Page>
  )
}

export default Blog