import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import Image from "next/image";
import Head from "next/head"
import Link from "next/link";
import Page from "../components/Page";
import Crud from "../components/Crud";
import { lugar } from "@prisma/client";
import UploadImages from "./uploadImages";

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

const Component: React.FC<Props<lugar>> = (props) => {
  const navElements = [{link:"#", title:"Link 1"},
  {link:"#", title:"Link 2"},
  {link:"#", title:"Link 3"}];
  return (
    <Page>
    </Page>
  )
}
export default Component;