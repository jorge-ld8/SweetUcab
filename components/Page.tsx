import React, { ReactNode, useEffect }  from "react";
import Image from "next/image";
import Layout from "./Layout";
import NavBar, {NavElement} from "./NavBar";


const Page: React.FC<{children: ReactNode, navElements: NavElement[]}> = (props) => {
   useEffect(()=>{
    console.log("Page Component mounted");
   })
   return (
    <div>
      {/* <h2>{post.l_descripcion}</h2> */}
      {/* <small>By {authorName}</small> */}
      {/* <small>Tipo {post.l_tipo}</small>
      <ReactMarkdown children={post.content} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style> */}
       <Layout> 
            <header>
                <a href="/"><Image src="/images/logoSweetUcab.png" alt="SweetUcab logo" className="imagenLogo" width={300} height={130}/></a>
                <ul className="icons">
                    <li>
                    <div>
                        <Image src="/images/iconoPersona.png" alt="Icono Persona" height={60} width={70}/>
                    </div>
                    </li>
                    <li>
                    <div className="shoppingCart">
                    <Image src="/images/iconoCarrito.png" alt="Icono Carrito" height={60} width={70}/>
                    </div>
                    </li>
                </ul>
            </header>
        <NavBar links={props.navElements}/>
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