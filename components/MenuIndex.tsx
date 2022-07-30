import React, {useEffect, useState} from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import Link from "next/link";
import { lugar } from "@prisma/client";
import UserProfile from "../pages/userSession";
import AccessControl from "../components/AcesssControl";
import { ReactSession} from 'react-client-session';
import ComponenteMenu from "./ComponenteMenu";


type props = {
  handleStateChange: Function,
  roles: string[]
}

const MenuIndex: React.FC<props> = (props) => {
  useEffect(() => {
    let roles2 = JSON.parse(window.localStorage.getItem("roles")) ?? [];
    if ((props.roles).length !== roles2.length)
      props.handleStateChange(roles2);
    return () => {}
  },);

  let cruds = ["lugar", "usuario", "rol", "producto", "historico_punto", "oferta", 
               "presupuesto", "cliente_juridico", "cliente_natural", "factura", "dashboard",
               "flyer", "lista_empleados", "orden_interna","orden_fabrica","orden_despacho"];
  
  return(<>
    {cruds.map((value)=>{
        return(<ComponenteMenu nombre={value} roles={props.roles}></ComponenteMenu>)
      })}
      </>
  )
}
export default MenuIndex;