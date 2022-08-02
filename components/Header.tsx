import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Router from "next/router";
import styles from '../components/crud.module.css';
import AccessControl from "./AcesssControl";

type headerProps = {
  user: string
  handleUserChange: Function
  roles: string[]
}

const Header: React.FC<headerProps> = ({user, handleUserChange, roles}) => {
  var classNames = require('classnames');

  useEffect(() => {
    let user2 = JSON.parse(window.localStorage.getItem("username")) ?? "";
    if (user !== user2)
      handleUserChange(user2);
    return () => {}
  },)
  
  return (
    <header>
      <Link href="/"><Image src="/images/logoSweetUcab.png" alt="SweetUcab logo" className={classNames("imagenLogo", styles.cursor)} width={300} height={130} /></Link>
      <ul className="icons">
          <li>
          <div>
                <Image src="/images/iconoPersona.png" alt="Icono Persona" height={60} width={70} className={styles.cursor}
                onClick={()=>{Router.push(user ? `../perfilActual/${user}` : "../inicio_de_sesion")}}/>
          </div>
          </li>
          <li>
          <div className="shoppingCart">
            <AccessControl userPermissions={roles} allowedPermissions={["comprar"]} mode={"all"} 
            children={<Image src="/images/iconoCarrito.png" alt="Icono Carrito" height={60} width={70} className={styles.cursor} 
                      onClick={()=>{Router.push(`../carrito/${user}`)}}/>}/>
          </div>
          </li>
          {false ? <li>
            <div className={styles.puntoRojoLogin}>LOGGED IN</div>
          </li>:null} 
      </ul>
  </header>
  );
};

export default Header;
