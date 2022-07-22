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
  const feed = await prisma.cliente_natural.findMany(
    {orderBy:{
      c_id: 'asc',
    },
    select:{
        c_id: true,
        c_rif: true,
        c_nombre1: true,
        c_nombre2: true,
        c_apellido1: true,
        c_apellido2: true,
        c_direccion: true,
        c_cedula: true,
        c_cantidad_puntos: true,
        c_codigo_registro: true,
        fk_lugar: true,
        fk_tienda: true,
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
    <Page>
      <Crud headers={["ID", "RIF", "Primer Nombre","Segundo Nombre", "Primer Apellido","Segundo Apellido",
      "Dirección", "Cédula", "Cantidad de puntos", "Código de registro",
      "Código de lugar",  "Código de tienda de registro"]} content={props.feed} name={'cliente_natural'} stateChanger={handleStateChange}/>
    </Page>
  )
}

export default Blog
