import React, {useEffect, useState} from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import Link from "next/link";
import Page from "../components/Page";
import { lugar } from "@prisma/client";
import RolPost from "./rol/[id]";
import UserProfile from "./userSession";

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

  const [state, stateHandler] = useState(false);

  UserProfile.setName("Jorge");
  console.log(UserProfile.getName());
  //   function onChangeStateHandler(){
  //     stateHandler(!state);
  //   }

  //  useEffect(() => {
  //    first
  
  //    return () => {
  //      second
  //    }
  //  }, [third])
 
  return (
    <Page navElements={navElements}>
      <div><Link href="/lugar">LUGAR</Link></div>
      <div>
          <Link href="/usuario">USUARIO</Link>
      </div>
      <div>
          <Link href="/rol">ROL</Link>
      </div>
      <div>
          <Link href="/producto">PRODUCTO</Link>
      </div>
      <div>
          <Link href="/imagesTest">HISTORICO_PUNTO</Link>
      </div>
      <div>
          <Link href="/inicio_de_sesion">PRESUPUESTO</Link>
      </div>
      <div>
          <Link href="#">DESCUENTO</Link>
      </div>
    </Page>
  )
}
export default Component;