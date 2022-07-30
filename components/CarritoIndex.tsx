import React, {useEffect, useState} from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import Link from "next/link";
import { lugar, producto } from "@prisma/client";
import UserProfile from "../pages/userSession";
import AccessControl from "../components/AcesssControl";
import { ReactSession} from 'react-client-session';
import ComponenteMenu from "./ComponenteMenu";
import ComponenteCarrito from "./CarritoComponente";
import { List, ListItem, ListItemText } from "@mui/material";


type props = {
  handleStateChange: Function,
  carrito: [producto, number][]
}

const CarritoIndex: React.FC<props> = (props) => {
  useEffect(() => {
    let carrito2 = JSON.parse(window.localStorage.getItem("carrito")) ?? [];
    if ((props.carrito).length !== carrito2.length)
      props.handleStateChange(carrito2);
    return () => {}
  },);

  let montoTotal = 0;
  for(let prod of props.carrito){
    montoTotal += prod[1] * prod[0].p_precio_actual;
  }

  return(<List>
    {props.carrito.map((value)=>{
        return(<ComponenteCarrito producto={value[0]} cantidad={value[1]}></ComponenteCarrito>)
      })}
      <ListItem> 
        <ListItemText primary={`Monto Total: $${montoTotal}`}/>
      </ListItem>
      </List>
  )
}
export default CarritoIndex;