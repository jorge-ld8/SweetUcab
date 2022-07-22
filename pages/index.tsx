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
      <AccessControl userPermissions={UserProfile.getRol()} allowedPermissions={["lugar:read"]} mode={""}>
        <div>
          <Link href="/lugar">LUGAR</Link>
        </div>
      </AccessControl>
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
          <Link href="/historico_punto">HISTORICO_PUNTO</Link>
      </div>
      <div>
          <Link href="/presupuesto">PRESUPUESTO</Link>
      </div>
      <div>
          <Link href="/oferta">OFERTA</Link>
      </div>
      <div>
                <Link href="/cliente_juridico">CLIENTE JURIDICO</Link>
            </div>
            <div>
                      <Link href="/cliente_natural">CLIENTE NATURAL</Link>
                  </div>
    </Page>
  )
}
export default Component;