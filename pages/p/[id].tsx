import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import prisma from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.lugar.findUnique({
    where: {
      l_id : Number(params?.id),
      
    },
  });
  return {
    props: post,
  }
}

const Post: React.FC<PostProps> = (props) => {
  return (
    <Layout>
      <div>
        <h2>{props.l_descripcion}</h2>
        <p>Tipo {props.l_tipo || "Unknown type"}</p> 
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Post
