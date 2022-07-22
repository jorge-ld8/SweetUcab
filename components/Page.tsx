import React, { ReactNode, useEffect, useState }  from "react";
import Image from "next/image";
import Layout from "./Layout";
import NavBar from "./NavBar";
import UserProfile from "../pages/userSession";
import styles from '../components/crud.module.css';
import Link from "next/link";


const Page: React.FC<{children: ReactNode}> = (props) => {
  var classNames = require('classnames');
  return (
   <div>
       <Layout> 
        <div className="header">
            <header>
                <Link href="/"><Image src="/images/logoSweetUcab.png" alt="SweetUcab logo" className={classNames("imagenLogo", styles.cursor)} width={300} height={130} /></Link>
                <ul className="icons">
                    <li>
                    <div>
                        <Link href="../inicio_de_sesion">
                          <Image src="/images/iconoPersona.png" alt="Icono Persona" height={60} width={70} className={styles.cursor}/>
                        </Link>
                    </div>
                    </li>
                    <li>
                    <div className="shoppingCart">
                    <Link href="#">
                      <Image src="/images/iconoCarrito.png" alt="Icono Carrito" height={60} width={70} className={styles.cursor}/>
                    </Link>
                    </div>
                    </li>
                    {UserProfile.loggedIn() ? <li>
                      <div className={styles.puntoRojoLogin}>LOGGED IN</div>
                    </li>:null} 
                </ul>
            </header>
        <NavBar/>
        </div>
        <main id="root">
            {props.children}
        </main>
        <footer>
            <p>&copy; Todos los derechos reservados.</p>
        </footer>
      </Layout>
    </div>
  );
};

export default Page;