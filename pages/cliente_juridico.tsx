import React, {useEffect, useState} from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import Image from "next/image";
import Head from "next/head"
import Link from "next/link";
import Crud from "../components/Crud";
import { usuario } from "@prisma/client";
import superjson from "superjson";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.cliente_juridico.findMany(
    {orderBy:{
      c_id: 'asc',
    },
    select:{
        c_id: true,
        c_rif: true,
        c_razon_social: true,
        c_denom_comercial: true,
        c_capital_disponible: true,
        c_direccion: true,
        c_direccion_fiscal_ppal: true,
        c_pagina_web: true,
        c_cantidad_puntos: true,
        c_codigo_registro: true,
        fk_lugar: true,
        fk_lugar2: true,
        fk_tienda: true,
    }
   },
  );
  return {
    props: { feed: superjson.parse(superjson.stringify(feed)) },
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
    <main>
      <Crud headers={["ID", "RIF", "Razón Social","Denominación Comercial", "Capital",
      "Dirección", "Dirección Fiscal Principal", "Página web", "Cantidad de puntos", "Código de registro",
      "Código de lugar", "Código de lugar (fiscal)", "Código de tienda de registro"]} content={props.feed} name={'cliente_juridico'} stateChanger={handleStateChange}/>
    </main>
  )
}

export default Blog
