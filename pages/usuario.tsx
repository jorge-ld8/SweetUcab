import React, {useEffect, useState} from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import Image from "next/image";
import Head from "next/head"
import Link from "next/link";
import Page from "../components/Page";
import Crud from "../components/Crud";
import { usuario } from "@prisma/client";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.usuario.findMany(
    {orderBy:{
      u_id: 'asc',
    },
    select:{
        u_id: true,
        u_username: true,
        u_email: true,
        fk_rol: true,
    }
   },
  );
  return { 
    props: { feed }, 
    revalidate: 10 
  }
}

type Props<ArbType extends Object> = {
  feed: ArbType[]
}

const Blog: React.FC<Props<usuario>> = (props) => {
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
      <Crud headers={["ID", "Username","Email", "Rol"]} content={props.feed} name={'usuario'} stateChanger={handleStateChange}/>
    </Page>
  )
}

export default Blog
