import React, {useEffect, useState} from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import Image from "next/image";
import Head from "next/head"
import Link from "next/link";
import Crud from "../components/Crud";
import { lugar } from "@prisma/client";
import UserProfile from "./userSession";
import { responseSymbol } from "next/dist/server/web/spec-compliant/fetch-event";

export const getStaticProps: GetStaticProps = async () => {
    const feed = await prisma.lugar.findMany(
    {orderBy:{
      l_id: 'asc',
    }}
    );
    return { 
      props: { feed }, 
      revalidate: 10 
    } 
}

type Props<ArbType extends Object> = {
  feed: ArbType[]
}

const Blog: React.FC<Props<lugar>> = (props) => {
  console.log(UserProfile.getName());

  const[state, setState] = useState(props.feed); //state hook

  useEffect(() => {
   //componente mounts
   return () => {
      const fetchData = async() => {
        const data = await fetch("/api/lugar", {method: 'GET'});
        const json = await data.json();

        setState(JSON.parse(json));
      }
      fetchData().catch(e=>console.error);
   }
 }, [state]) //effect hook

  function handleStateChange(newState){
    setState(newState);
  }

  return (
    <main>
      <Crud headers={["ID", "Nombre", "Tipo", "FK_Lugar"]}content={state} name={'lugar'} stateChanger={handleStateChange}/>
    </main>
  )
}

export default Blog
