import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from '../components/crud.module.css';

type headerProps = {
  user: string
  handleUserChange: Function
}

const Header: React.FC<headerProps> = ({user, handleUserChange}) => {
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
              <Link href={user ? `../perfilActual/${user}` : "../inicio_de_sesion"}>
                <Image src="/images/iconoPersona.png" alt="Icono Persona" height={60} width={70} className={styles.cursor}/>
              </Link>
          </div>
          </li>
          <li>
          <div className="shoppingCart">
          <Link href="../carrito">
            <Image src="/images/iconoCarrito.png" alt="Icono Carrito" height={60} width={70} className={styles.cursor}/>
          </Link>
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
