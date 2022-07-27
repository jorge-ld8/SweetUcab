import React, { ReactNode } from "react";
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import prisma from '../../lib/prisma';
import Page from "../../components/Page"
import Router from "next/router"
import { Formik, FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';
import { cliente_natural, lugar, producto, tienda } from "@prisma/client";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "@mui/material/Button";
import { FileUploadButton } from "../components/FileUploadButton";
import DropDownList from "../../components/Dropdownlist";
import superjson from "superjson";

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const feed = await prisma.tienda.findMany();
    const c_naturales = await prisma.cliente_natural.findMany();
    const cliente = await prisma.cliente_natural.findUnique({
        where:{
            c_id: Number(params?.id),
        }
    });
    return {
      props: {feed: feed, c_naturales: c_naturales, cliente: cliente},
    }
  }

type Props = {
    feed: tienda[]
    c_naturales: cliente_natural[]
    cliente: cliente_natural
}

const Component: React.FC<Props> = (props)=>
{
    const formik = useFormik({
        initialValues:{
          rif: String(props.cliente.c_rif),
          cantidad_puntos: Number(props.cliente.c_cantidad_puntos),
          nombre1: String(props.cliente.c_nombre1),
          nombre2: String(props.cliente.c_nombre2),
          apellido1: String(props.cliente.c_apellido1),
          apellido2: String(props.cliente.c_apellido2),
          cedula: String(props.cliente.c_cedula),
          direccion: String(props.cliente.c_direccion),
          tienda: {} //colocar tiend
        },
        validationSchema: Yup.object(
          {
            rif: Yup.string().required("Obligatorio").matches(/^[VJEPG]{1}-[0-9]{8}$/, "RIF no válido")
            .test("uniqueValidation", "No es unico", 
            function(value){
                for(let p of props.c_naturales){
                    if(p.c_rif === value)
                        return false;
                }
                return true;
               })
            ,
            nombre1: Yup.string().required("Obligatorio").max(20,"Máximo 20 caracteres"),
            nombre2: Yup.string().max(20,"Máximo 20 caracteres"),
            apellido1: Yup.string().required("Obligatorio").max(20,"Máximo 20 caracteres"),
            apellido2: Yup.string().max(20,"Máximo 20 caracteres"),
            cedula: Yup.string().max(10,"Maximo 10 caracereres")
            .test("uniqueValidation", "No es unico", 
            function(value){
                for(let p of props.c_naturales){
                    if(p.c_cedula === value)
                        return false;
                }
                return true;
               })
            ,
            direccion: Yup.string().required("Obligatorio").max(50, "Máximo 50 caraceres"),
            tienda: Yup.string().required("Obligatorio")
         }
        ),
        onSubmit: values => {console.log(values);},
      });
      
      async function handleSubmit(e){
        e.preventDefault();
        console.log(JSON.stringify({
            rif: formik.values.rif,
            nombre1: formik.values.nombre1,
            nombre2: formik.values.nombre2,
            apellido1: formik.values.apellido1,
            apellido2: formik.values.apellido2,
            cedula: formik.values.cedula,
            direccion: formik.values.direccion,
            tienda: formik.values.tienda
        }));

            
        const response = await fetch(`/api/cliente_juridico`,{method: 'POST',         
        body:   JSON.stringify({
                    rif: formik.values.rif,
                    nombre1: formik.values.nombre1,
                    nombre2: formik.values.nombre2,
                    apellido1: formik.values.apellido1,
                    apellido2: formik.values.apellido2,
                    cedula: formik.values.cedula,
                    direccion: formik.values.direccion,
                    tienda: formik.values.tienda})
        }).then(response =>{ 
          if(response.ok)
            return response.json()
          }
        ).catch(e => console.error(e))
        console.log(response);
        Router.back();
      }

    return (
        <Layout>
          <Page>
          <form  onSubmit={handleSubmit} >
              <ul>
                  <li>
                      <label htmlFor="rif">RIF:</label>
                      <input type="text" id="rif"
                      {...formik.getFieldProps('rif')}/>
                      <ErrorMessage touched={formik.touched.rif} errors={formik.errors.rif}/>
                  </li>
                  <li>
                      <label htmlFor="nombre1">Primer Nombre:</label>
                      <input type="text" id="nombre1"
                      {...formik.getFieldProps('nombre1')}/>
                      <ErrorMessage touched={formik.touched.nombre1} errors={formik.errors.nombre1}/>
                  </li>
                  <li>
                      <label htmlFor="nombre2">Segundo Nombre:</label>
                      <input type="text" id="nombre2"
                      {...formik.getFieldProps('nombre2')}/>
                      <ErrorMessage touched={formik.touched.nombre2} errors={formik.errors.nombre2}/>
                  </li>
                  <li>
                      <label htmlFor="apellido1">Primer apellido:</label>
                      <input type="text" id="apellido1"
                      {...formik.getFieldProps('apellido1')}/>
                      <ErrorMessage touched={formik.touched.apellido1} errors={formik.errors.apellido1}/>
                  </li>
                  <li>
                      <label htmlFor="apellido2">Segundo apellido:</label>
                      <input type="text" id="apellido2"
                      {...formik.getFieldProps('apellido2')}/>
                      <ErrorMessage touched={formik.touched.apellido2} errors={formik.errors.apellido2}/>
                  </li>
                  <li>
                      <label htmlFor="cedula">Cedula:</label>
                      <input type="text" id="cedula"
                      {...formik.getFieldProps('cedula')}/>
                      <ErrorMessage touched={formik.touched.cedula} errors={formik.errors.cedula}/>
                  </li>
                  <li>
                      <label htmlFor="direccion">Direccion:</label>
                      <input type="text" id="direccion"
                      {...formik.getFieldProps('direccion')}/>
                      <ErrorMessage touched={formik.touched.direccion} errors={formik.errors.direccion}/>
                  </li>
                  <li>
                      <label htmlFor="tienda">Tienda a la que pertenece:</label>
                      <DropDownList content={props.feed} attValueName={"t_nombre"} objType={"tienda"} name={"tienda"} onChange={formik.handleChange} value={formik.values.tienda}/>
                  </li>
                  <li className="Button">
                      <Button type={"submit"} variant="contained" color={"success"} disabled={!(formik.isValid && formik.dirty)}>Crear</Button>
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

export default Component;