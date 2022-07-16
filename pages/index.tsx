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

export const getStaticProps: GetStaticProps = async () => {
  // const feed = [
  //   {
  //     id: "1",
  //     title: "Prisma is the perfect ORM for Next.js",
  //     content: "[Prisma](https://github.com/prisma/prisma) and Next.js go _great_ together!",
  //     published: false,
  //     author: {
  //       name: "Nikolas Burk",
  //       email: "burk@prisma.io",
  //     },
  //   },
  // ]

  const feed = await prisma.lugar.findMany();
  return { 
    props: { feed }, 
    revalidate: 10 
  }
}

type Props<ArbType extends Object> = {
  feed: ArbType[]
}

const Blog: React.FC<Props<lugar>> = (props) => {
  const navElements = [{link:"#", title:"Link 1"},
  {link:"#", title:"Link 2"},
  {link:"#", title:"Link 3"}];

  const CrudHeaders = ['l_id', 'l_descripcion', 'l_tipo', 'fk_lugar'];

  return (
    <Page navElements={navElements}>
      <Crud content={props.feed}/>
      {/* {props.feed.map((post) => (
      <div key={post.id} className="post">
        <Post post={post} />
      </div>
   ))} */}
    </Page>
  )
}

export default Blog
