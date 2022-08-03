import Router from "next/router";
import React, { useEffect } from "react";
import UserProfile from "../pages/userSession";
import AccessControl from "./AcesssControl";

const NavBar: React.FC<any> = ({roles, handleStateChange}) => {
    useEffect(() => {
      let roles2 = JSON.parse(window.localStorage.getItem("roles")) ?? [];;
      if (roles.length !== roles2.length)
        handleStateChange(roles2);
      return () => {}
    },)

    
    const navElements =[<li key={1}><a href="#">INICIO</a></li>,  
                        <AccessControl userPermissions={roles} allowedPermissions={["comprar"]} mode={"all"} children={<li key={2} onClick={()=>{Router.push("/compra")}}><a href="#">COMPRA</a></li>}/>, 
                        <AccessControl userPermissions={roles} allowedPermissions={["pick_and_mix"]} mode={"all"} children={<li key={2} onClick={()=>{Router.push("/pick_and_mix")}}><a href="#">PICK AND MIX</a></li>}/>,

                        <AccessControl userPermissions={roles} allowedPermissions={["usuario:read", "rol:read", "producto:read", "historico_punto:read",
                                                                                                    "presupuesto:read", "descuento:read"]} mode={"one"} children={<li key={3}><a href="#">GESTIÓN SWEET UCAB</a></li>}></AccessControl>];                                                                                       
    return(
        <nav>
            <ul>
                {navElements.map((element)=>{return element;})}
            </ul>
        </nav> 
    );
}

export default NavBar;