import React, { ReactNode, useCallback, useState } from "react";
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import prisma from '../lib/prisma';
import Page from "../components/Page"
import Router from "next/router"
import { Formik, FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';
import styles from '../components/crud.module.css';
import { lugar, permiso, producto, rol } from "@prisma/client";
import ErrorMessage from "../components/ErrorMessage";
import DropDownList from "../components/Dropdownlist";
import Button from "@mui/material/Button";
import superjson from "superjson";
import UserProfile from "./userSession";

export const getServerSideProps: GetServerSideProps = async () => {
    const productos = await prisma.producto.findMany();

    return {
      props: {productos},
    }
  }

type Props = {
    productos: producto[]
}

const listaProds = [];
let FechaServidor;

const NewPresupuesto: React.FC<Props> = (props)=>
{
    const  formik = useFormik({
        initialValues: {
          fecha_creacion: '',
          fk_c_j: '',
          fk_c_n: '',
        },
        validationSchema: Yup.object(
          {
            fecha_creacion: Yup.date(),
          }
        ),
        onSubmit: values => {console.log(values);},
      });

    // formulario 2 para introducir productos
    const formik2 = useFormik({
        initialValues: {
            producto_actual: '',
            cantidad: 0,
        },
        validationSchema: Yup.object({
            producto_actual: Yup.string().required(),
            cantidad: Yup.number().min(0,"Cantidad debe ser mayor a 0")
        }),
        onSubmit: values => {console.log(values)},
    })
      
  
      async function handleSubmit(e){
        e.preventDefault();
        console.log(superjson.stringify({fecha_creacion: FechaServidor,
                                        lista_presupuesto: UserProfile.getProductosPresupuesto()}));
        const response = await fetch(`/api/presupuesto`,{method: 'POST', 
        body: superjson.stringify({fecha_creacion: FechaServidor,
                                   username: UserProfile.getName(),
                                   lista_presupuesto: UserProfile.getProductosPresupuesto()})
        }).then(response =>{ 
          if(response.ok)
            return response.json()
          }
        ).catch(e => console.error(e));
        console.log(response);
        Router.back();
      }

       async function handleSubmit2(e){
        e.preventDefault();
        UserProfile.addProductoCantidad(formik2.values.producto_actual, formik2.values.cantidad);
        listaProds.push([formik2.values.producto_actual, formik2.values.cantidad])
        console.log(UserProfile.getProductosPresupuesto());
        console.log(listaProds);
        if(listaProds.length === 0 )
            FechaServidor = formik.values.fecha_creacion;
        }
        
        console.log(UserProfile.getName());
        
    return (
        <Layout>
          <Page>
          <form  onSubmit={handleSubmit} >
              <ul>
              <li>
                    <label htmlFor="fecha_inicio">Fecha creación:</label>
                    <input type="date" id="fecha_inicio"
                    {...formik.getFieldProps('fecha_inicio')}/>
                    <ErrorMessage touched={formik.touched.fecha_creacion} errors={formik.errors.fecha_creacion}/>
              </li>
              <li>
                    <form >
                        <ul>
                            <li>
                            <label htmlFor="producto_actual">Introduzca producto: </label>
                            <DropDownList content={props.productos} attValueName={"p_nombre"} objType={"producto"} name={"producto_actual"} onChange={formik2.handleChange} value={formik2.values.producto_actual}/>
                            </li>
                            <li>
                            <label htmlFor="cantidad">Cantidad: </label>
                                <input type="number" id="cantidad"
                                {...formik2.getFieldProps('cantidad')}/>
                                <ErrorMessage touched={formik2.touched.cantidad} errors={formik2.errors.cantidad}/>
                            </li>
                            <li className="button">
                                <Button type={"submit"} variant="contained" disabled={!(formik2.isValid && formik2.dirty)} onClick={handleSubmit2}>Añadir Producto</Button>
                            </li>
                        </ul>
                    </form>
                </li>
              <li className="button">
                   <Button type={"submit"}variant="contained" disabled={!(formik.isValid && formik.dirty && listaProds.length >= 1)} color={"success"}>Crear Presupuesto</Button>
              </li>
              </ul>
          </form>
          <style jsx>{`
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
              padding: 1rem 2rem;
            }
    
            button + button {
              margin-left: 1rem;
            }
  
            form div{
              margin: .5em;
            }
          `}</style>
          </Page>
        </Layout>
      )
};

export default NewPresupuesto;