import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../components/Layout"
import { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import { useRouter } from "next/router"

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let id;
  window.onload = function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    id = urlParams.get('id');
  }
  
    console.log(id);
    const lugar = await prisma.lugar.findUnique({
      where: {
        l_id :  Number(id)
      },
    });
    return {
      props: lugar,
    }
  }
  
  const LugarPost: React.FC<PostProps> = (props) => {
    const router = useRouter();
    return (
      <Layout>
       <form action="" method="">
            <ul>
                <li>
                    <label htmlFor="descripcion">Descripcion:</label>
                    <input type="text" id="descripcion" name="descripcion" value="noVal"/>
                </li>
                <li>
                    <label htmlFor="Tipo">Tipo:</label>
                    <input type="text" id="tipo" name="tipo" value="noVal"/>
                </li>
                <li className="button">
                    <button type="submit">Aceptar</button>
                </li>
            </ul>
        </form>
        {/* <div>
          <h2>{props.l_descripcion}</h2>
          <p>{props.l_id}</p>
          <p>{props.fk_lugar}</p>
          <p>Tipo {props.l_tipo || "Unknown type"}</p> 
        </div> */}
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
  
  export default LugarPost;