import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import Image from "next/image";
import prisma from '../../lib/prisma';
import { imagen_producto, producto } from "@prisma/client"
import { imageConfigDefault } from "next/dist/server/image-config";
import Button from "@mui/material/Button";
import * as Yup from 'yup';
import { Formik, FormikProvider, useFormik } from "formik";
import ErrorMessage from "../../components/ErrorMessage";
import { TextField } from "@mui/material";
import UserProfile from "../userSession";
import Router from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const producto = await prisma.producto.findUnique({
      where: {
        p_id : Number(params?.id),
      },
    });
    const imagen = await prisma.imagen_producto.findMany({
      where: {
        fk_producto: Number(params?.id)
      }
    });
    const preciogramo=producto.p_precio_actual/producto.p_peso;
    return {
      props: {producto, imagen, preciogramo}
    }
  }

  type ProductoProps = {
    producto: producto,
    imagen: imagen_producto[]
    preciogramo: preciogramo
  }

  const ProductoPost: React.FC<ProductoProps>= (props) => {
    const formik = useFormik({
        initialValues:{
            cantidad: 0
        },
        validationSchema: Yup.object(
          {
            cantidad: Yup.number().min(1,"Seleccione una peso válido").required("Coloque una cantidad si desea comprar")
         }
        ),
        onSubmit: values => {console.log(values);},
      });

    async function handleSubmit(e){
        e.preventDefault();
        if (formik.values.cantidad%props.preciogramo!=0){
        document.getElementById("mensajegramos").textContent="Introduzca una cantidad múltiplo del precio.";
        console.log("Nope!")
        return;
        }

        //hay que confgurar carrito
        const producto = await fetch(`/api/producto/${props.producto.p_id}`,{method: 'GET'})
        .then(response =>{
          if(response.ok)
            return response.json()
          }
        ).catch(e => console.error(e))
        let carritoActual = JSON.parse(window.localStorage.getItem("carrito")) ?? [];
        for(let prodCant of carritoActual){
            if(prodCant[0]=== producto){
                prodCant[1] += formik.values.cantidad;
                Router.back();
            }
        }
        producto.p_nombre=producto.p_nombre+" P&M";
        producto.p_precio_actual=formik.values.cantidad*props.preciogramo;
        let carritoCurrent = JSON.parse(window.localStorage.getItem("carrito"));
        carritoCurrent.push([producto, 1]);
        window.localStorage.setItem("carrito", JSON.stringify(carritoCurrent));
        console.log("productos en carrito:", JSON.stringify(carritoCurrent));
                            Router.back();
    }

    return (
        <main>
        <h2>pick and mix</h2>
        <div className="stylish">
          <div className="imagen">{<img src={props.imagen[0].i_imagen}/>}</div>
          <h2 className="nombre">{props.producto.p_nombre}</h2>

          <div className="precio">Precio por g: {props.preciogramo}$</div>
          <div className="descripcion">{props.producto.p_descripcion}</div>
          <div className="cantidad">Gramos a comprar:
          <h4 id="mensajegramos"></h4>
            <form onSubmit={handleSubmit} className="addToCart" id="addToCart">
                     <input type="number" id="cantidad"
                      {...formik.getFieldProps("cantidad")}/>
                     <ErrorMessage touched={formik.touched.cantidad} errors={formik.errors.cantidad}/>
                     <div className="btnCarrito">
                    <Button id="addToCart" type="submit" variant="contained"  sx={{
                        bgcolor: '#E02464',
                    }} disabled={!(formik.isValid && formik.dirty)}>Añadir al carrito</Button></div>
            </form>
          </div>
          </div>
        <style jsx>{`
           .addToCart{
             display: inline;
           }
           input{
            width: 4.5em;
           }
           .stylish{
             display: grid;
             grid-template-areas:
                    "imagen nombre"
                    "imagen precio"
                    "imagen descripcion"
                    "imagen cantidad"
                    "imagen btnCarrito";
             grid-template-columns: 1fr 1fr;
             row-gap: 1.5em;
             column-gap: 0;
           }

           .imagen{
             display: flex;
             grid-area: imagen;
             justify-content: center;
             max-height: 54vh;
           }

           .nombre{
             grid-area: nombre;
           }

           .precio{
            grid-area: precio;
           }

           .descripcion{
            grid-area: descripcion;
           }

           .btnCarrito{
            grid-area: btnCarrito;
           }

          img{
            max-width: 50%;
            display: inline-block;
          }

          .page {
            background: white;
            padding: 2rem;
          }

          .actions {
            margin-top: 2rem;
          }

          button {
            background: #ececec;
            border: 0;
            border-radius: 0.125rem;
            margin-top: .5em;
            padding: 1rem 2rem;
          }
        `}</style>
        </main>
    )
  }

  export default ProductoPost;