import React from "react";
import UserProfile from "../pages/userSession";
import AccessControl from "./AcesssControl";

const NavBar: React.FC = () => {
    const navElements =[<li key={1}><a href="#">INICIO</a></li>,  
                            <AccessControl userPermissions={UserProfile.getRol()} allowedPermissions={["comprar"]} mode={"all"} children={<li key={2}><a href="#">COMPRA</a></li>}/>, 
                            <AccessControl userPermissions={UserProfile.getRol()} allowedPermissions={["usuario:read", "rol:read", "producto:read", "historico_punto:read",
                                                                                                       "presupuesto:read", "descuento:read"]} mode={"one"} children={<li key={3}><a href="#">GESTIÓN SWEET UCAB</a></li>}></AccessControl>];
                                                                                                   
    return(
        <nav>
            <ul>
                {navElements.map((element)=>{return element;})}
            </ul>
            <style jsx>{`
                nav a:hover{
                    background-color: #C00444;
                }
            `}
            </style>
        </nav> 
    );
}

export default NavBar;