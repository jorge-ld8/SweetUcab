import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { lugar } from "@prisma/client";

export type PostProps = {
  // id: string;
  // title: string;
  // author: {
  //   name: string;
  //   email: string;
  // } | null;
  // content: string;
  // published: boolean;

  l_descripcion: string;
  l_tipo: string;
  l_id: Number;
  fk_lugar: Number;
};

const Post: React.FC<{ post: lugar }> = ({ post }) => {
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.l_id}`)}>
      <h2>{post.l_descripcion}</h2>
      {/* <small>By {authorName}</small> */}
      <small>Tipo {post.l_tipo}</small>
      {/* <ReactMarkdown children={post.content} /> */}
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;
