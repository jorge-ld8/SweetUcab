import React, {useEffect, useState} from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import Link from "next/link";
import Page from "../components/Page";
import { lugar } from "@prisma/client";
import RolPost from "./rol/[id]";
import UserProfile from "./userSession";
import AccessControl from "../components/AcesssControl";

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
  const [state, stateHandler] = useState(false);

  console.log(UserProfile.getRol());
  console.log(`Is logged in?: ${UserProfile.loggedIn()}`);
  return (
    <Page>
      <AccessControl userPermissions={UserProfile.getRol()} allowedPermissions={["lugar:read"]} mode={"all"}>
        <div>
          <Link href="/lugar">LUGAR</Link>
        </div>
      </AccessControl>
      <AccessControl userPermissions={UserProfile.getRol()} allowedPermissions={["usuario:read"]} mode={"all"}>
        <div>
            <Link href="/usuario">USUARIO</Link>
        </div>
      </AccessControl>
      <AccessControl userPermissions={UserProfile.getRol()} allowedPermissions={["rol:read"]} mode={"all"}>
        <div>
            <Link href="/rol">ROL</Link>
        </div>
      </AccessControl>
      <AccessControl userPermissions={UserProfile.getRol()} allowedPermissions={["producto:read"]} mode={"all"}>
        <div>
            <Link href="/producto">PRODUCTO</Link>
        </div>
      </AccessControl>
      <AccessControl userPermissions={UserProfile.getRol()} allowedPermissions={["historico_punto:read"]} mode={"all"}>
        <div>
            <Link href="/historico_punto">HISTORICO_PUNTO</Link>
        </div>
      </AccessControl>
      <AccessControl userPermissions={UserProfile.getRol()} allowedPermissions={["oferta:read"]} mode={"all"}>
        <div>
            <Link href="/oferta">OFERTA</Link>
        </div>
      </AccessControl>
      <AccessControl userPermissions={UserProfile.getRol()} allowedPermissions={["cliente_juridico:read"]} mode={"all"}>
        <div>
              <Link href="/cliente_juridico">CLIENTE JURIDICO</Link>
        </div>
      </AccessControl >
            <AccessControl userPermissions={UserProfile.getRol()} allowedPermissions={["cliente_natural:read"]} mode={"all"}>
              <div>
                <Link href="/cliente_natural">CLIENTE NATURAL</Link>
              </div>
      </AccessControl>
      <style jsx>{`
        div{
          margin: 0.6em;
          font-size: 1.2rem;
        }
      `}</style>
    </Page>
  )
}
export default Component;