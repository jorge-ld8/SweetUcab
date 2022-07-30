import React, {useEffect, useState} from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import Link from "next/link";
import { lugar, producto } from "@prisma/client";
import UserProfile from "../pages/userSession";
import AccessControl from "./AcesssControl";
import { ReactSession} from 'react-client-session';
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Delete } from "@mui/icons-material";
import Router from "next/router";


type props = {
  producto: producto
  cantidad: number
}

const ComponenteCarrito: React.FC<props> = (props) => {  

  function handleDelete(e){
    e.preventDefault();
    console.log("HANDLE DELETE");
    let currCarrito = JSON.parse(window.localStorage.getItem("carrito"));
    currCarrito.splice(currCarrito.find(producto => producto === props.producto), 1);
    window.localStorage.setItem("carrito", JSON.stringify(currCarrito));
    Router.reload();
  }

  return(
    <>
      <ListItem disablePadding>
          <ListItemButton>
              <ListItemText primary={props.producto.p_nombre.padEnd(40, " ")} secondary={"Cantidad: " + props.cantidad + "   $" + props.producto.p_precio_actual} />
              {/* <ListItemText primary={props.cantidad} /> */}
              <ListItemIcon>
                  <IconButton aria-label="delete" size="medium" onClick={handleDelete}><Delete sx={{ color: 'black' }} /></IconButton>
              </ListItemIcon>
          </ListItemButton>
      </ListItem>
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
export default ComponenteCarrito;                       
                       
                       
