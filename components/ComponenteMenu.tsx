import React, {useEffect, useState} from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import Link from "next/link";
import { lugar } from "@prisma/client";
import UserProfile from "../pages/userSession";
import AccessControl from "../components/AcesssControl";
import { ReactSession} from 'react-client-session';


type props = {
  nombre: string
  roles: string[]
}

const Component: React.FC<props> = (props) => {  
  return(
    <>
        <AccessControl userPermissions={props.roles} allowedPermissions={[`${props.nombre}:read`]} mode={"one"}>
          <div>
            <Link href={`/${props.nombre}`}>{props.nombre.toUpperCase()}</Link>
          </div>
        </AccessControl>
        <style jsx>{`
            div{
                margin: 0.6em;
                font-size: 1.3em;
            }
        `}       
        </style>
    </>
  )
}
export default Component;