import React, {useEffect, useState} from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import Link from "next/link";
import { lugar } from "@prisma/client";
import RolPost from "./rol/[id]";
import UserProfile from "./userSession";
import AccessControl from "../components/AcesssControl";
import { ReactSession} from 'react-client-session';
import App from "./_app";
import ComponenteMenu from "../components/ComponenteMenu";
import MenuIndex from "../components/MenuIndex";

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
  const [roles, setappState] = useState([]);
  function handleStateChange(appState){
    setappState(appState);
  }
  
  useEffect(() => {
    console.log("Roles actuales");
    console.log(window.localStorage.getItem("roles"));
    return () => {
    }
  },)
  
  return(
        <main>
          <MenuIndex handleStateChange={handleStateChange} roles={roles}></MenuIndex>
        <style jsx>{`
          div{
            color: pink;
            margin: 0.6em;
            font-size: 1.3rem;
          }
        `}</style>
        </main>
  )
}
export default Component;