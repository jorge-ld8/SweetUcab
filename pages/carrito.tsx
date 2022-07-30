import React, { useState } from "react"
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import Image from "next/image";
import prisma from '../lib/prisma';
import { imagen_producto, producto } from "@prisma/client"
import { imageConfigDefault } from "next/dist/server/image-config";
import Button from "@mui/material/Button";
import * as Yup from 'yup';
import { Formik, FormikProvider, useFormik, validateYupSchema } from "formik";
import ErrorMessage from "../components/ErrorMessage";
import { Container, FormControl, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, NativeSelect, styled, TextField } from "@mui/material";
import UserProfile from "./userSession";
import Router from "next/router";
import { GetStaticProps } from "next";
import { Delete } from "@mui/icons-material";
import CarritoIndex from "../components/CarritoIndex";

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
    // const producto = await prisma.producto.findUnique({
    //   where: {
    //     p_id : Number(params?.id),
    //   },
    // });
    // const imagen = await prisma.imagen_producto.findMany({
    //   where: {
    //     fk_producto: Number(params?.id)
    //   }
    // })
    let productos = await prisma.producto.findMany();
    return {
        //   props: {producto, imagen}
        props: { productos }
    }
}

type ProductoProps = {
    producto: producto,
    imagen: imagen_producto[]
}

const ProductoPost: React.FC<ProductoProps> = (props) => {
    const [carrito, setCarrito] = useState([]);

    function handleStateChange(newState){
        setCarrito(newState);
    }

    const formik = useFormik({
        initialValues: {
            cantidad: 0
        },
        validationSchema: Yup.object(
            {
                cantidad: Yup.number().min(1, "Seleccione una cantidad válida").required("Coloque una cantidad si desea comprar")
            }
        ),
        onSubmit: values => { console.log(values); },
    });
    async function handleSubmit(e) {
        e.preventDefault();
        const producto = await fetch(`/api/producto/${props.producto.p_id}`, { method: 'GET' })
            .then(response => {
                if (response.ok)
                    return response.json()
            }
            ).catch(e => console.error(e))
        let carritoActual = JSON.parse(window.localStorage.getItem("carrito"))
            ?? window.localStorage.setItem("carrito", JSON.stringify([])) ?? [];
        //chequear si producto ya esta en el carrito
        for (let prodCant of carritoActual) {
            if (prodCant.producto === producto) {
                producto.cantidad += formik.values.cantidad;
                Router.back();
            }
        }
        carritoActual.push({
            producto: producto,
            cantidad: formik.values.cantidad
        });
        Router.back();
    }
    const metodosPago: string[] = ["cheque", "efectivo", "pagomovil", "paypal", "punto", "tarjeta", "zelle"];

    return (
        <main>
            <div className="stylish">
                <Container>
                    <h2>  CARRITO DE COMRAS </h2>
                    <CarritoIndex handleStateChange={handleStateChange} carrito={carrito}></CarritoIndex>
                    <div id="pago">
                        <Button variant="contained" id="pago" sx={{
                            bgcolor: '#E02464',
                        }} onClick={()=>{Router.push("/pago")}}>
                            PAGAR
                        </Button>
                    </div>
                </Container>
                <Container sx={{bgcolor: '#FEE2E6', borderRadius: 5, marginRight: 10}} className={"pagoElement"}>
                    <h4>Pago</h4>
                    <div>
                        <FormControl>
                            <InputLabel variant="standard" htmlFor="metodo_pago_1">
                                Metodo 1
                            </InputLabel>
                            <NativeSelect
                                defaultValue={""}
                                inputProps={{
                                    name: "metodo_pago_1",
                                    id: "metodo_pago_1"
                                }}
                                sx={{bgcolor: 'white', borderRadius: 1}}
                                >
                                {metodosPago.map((value)=>{
                                    return (<option value={value}>{value.toLowerCase()}</option>)
                                })}
                            </NativeSelect>
                        </FormControl>
                        <FormControl sx={{marginLeft: 5}} >
                            <InputLabel variant="standard" htmlFor="monto1">
                                Monto 1
                            </InputLabel>
                            <TextField sx={{bgcolor: 'white', borderRadius: 1, width: 150, paddingLeft: 1}}
                            id="monto1" label="monto1" variant="standard" type="number"/>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl margin="dense">
                            <InputLabel variant="standard" htmlFor="metodo_pago_2">
                                Metodo 2
                            </InputLabel>
                            <NativeSelect
                                defaultValue={""}
                                inputProps={{
                                    name: "metodo_pago_2",
                                    id: "metodo_pago_2"
                                }}
                                sx={{bgcolor: 'white', borderRadius: 1}}
                                >
                                {metodosPago.map((value)=>{
                                    return (<option value={value}>{value.toLowerCase()}</option>)
                                })}
                            </NativeSelect>
                        </FormControl>
                        <FormControl sx={{marginLeft: 5, marginTop: 1}} >
                            <InputLabel variant="standard" htmlFor="monto2">
                                Monto 2
                            </InputLabel>
                            <TextField sx={{bgcolor: 'white', borderRadius: 1, width: 150, paddingLeft: 1}}
                            id="monto2" label="monto2" variant="standard" type="number"/>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl margin="dense">
                            <InputLabel variant="standard" htmlFor="metodo_pago_3">
                                Metodo 2
                            </InputLabel>
                            <NativeSelect
                                defaultValue={""}
                                inputProps={{
                                    name: "metodo_pago_3",
                                    id: "metodo_pago_3"
                                }}
                                sx={{bgcolor: 'white', borderRadius: 1}}
                                >
                                {metodosPago.map((value)=>{
                                    return (<option value={value}>{value.toLowerCase()}</option>)
                                })}
                            </NativeSelect>
                        </FormControl>
                        <FormControl sx={{marginLeft: 5, marginTop: 1}} >
                            <InputLabel variant="standard" htmlFor="monto3">
                                Monto 2
                            </InputLabel>
                            <TextField sx={{bgcolor: 'white', borderRadius: 1, width: 150, paddingLeft: 1}}
                            id="monto3" label="monto3" variant="standard" type="number"/>
                        </FormControl>
                    </div>
                    <br />
                    <div>Cantidad puntos: {window.localStorage.getItem("puntos")}</div>
                </Container>
            </div>
            <style jsx>{`
            .pagoElement{
                max-height: 70vh;
            }

           #pago{
             margin: 1em;
           }

           input{
            width: 4.5em;
           }

           .stylish{
             display: grid;
             grid-template-columns: 2fr 1fr;
             row-gap: 1.5em;
             column-gap: 0;
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