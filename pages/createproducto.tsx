import React, { ReactNode } from "react";
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import prisma from '../lib/prisma';
import Page from "../components/Page"
import Router from "next/router"
import { Formik, FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';
import { lugar, producto } from "@prisma/client";
import ErrorMessage from "../components/ErrorMessage";
import UploadImages from "./uploadImages";
import Button from "@mui/material/Button";
import { FileUploadButton } from "../components/FileUploadButton";

export const getServerSideProps: GetServerSideProps = async () => {
    const feed = await prisma.producto.findMany();
    return {
      props: {feed},
    }
  }

type Props<ArbType extends Object> = {
    feed: ArbType[]
}
  

const Component: React.FC<Props<producto>> = (props)=>
{
    const formik = useFormik({
        initialValues:{
          nombre: '',
          descripcion: '',
          peso: 0,
          precio_actual: 0,
          image: null
        },
        validationSchema: Yup.object(
          {
            descripcion: Yup.string().max(35, 'Máximo 35 caracteres de longitud').required("Obligatorio"),
            nombre: Yup.string().max(20, 'Maximo 20 caracteres de longitud').required("Obligatorio"),
            peso: Yup.number().min(0, "Debe ser positivo").max(999999, "Máximo 999999").required("Obligatorio"),
            precio_actual: Yup.number().min(0, "Debe ser positivo").required("Obligatorio")
         }
        ),
        onSubmit: values => {console.log(values);},
      });
      
      async function handleSubmit(e){
        e.preventDefault();
        console.log(JSON.stringify({descripcion: formik.values.descripcion, 
            nombre: formik.values.nombre,
            peso: formik.values.peso,
            precio_actual: formik.values.precio_actual,
            image:formik.values.image}));

            
        const response = await fetch(`/api/producto`,{method: 'POST',         
        body: JSON.stringify({descripcion: formik.values.descripcion, 
                              nombre: formik.values.nombre,
                              peso: formik.values.peso,
                              precio_actual: formik.values.precio_actual,
                              image: formik.values.image})
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
                      <label htmlFor="nombre">Nombre:</label>
                      <input type="text" id="nombre"
                      {...formik.getFieldProps('nombre')}/>
                      <ErrorMessage touched={formik.touched.nombre} errors={formik.errors.nombre}/>
                  </li>
                  <li>
                      <label htmlFor="descripcion">Decripcion:</label>
                      <input type="text" id="descripcion"
                      {...formik.getFieldProps('descripcion')}/>
                      <ErrorMessage touched={formik.touched.descripcion} errors={formik.errors.descripcion}/>
                  </li>
                  <li>
                      <label htmlFor="peso">Peso:</label>
                      <input type="number" id="peso"
                      {...formik.getFieldProps('peso')}/>
                      <ErrorMessage touched={formik.touched.peso} errors={formik.errors.peso}/>
                  </li>
                  <li>
                      <label htmlFor="precio_actual">Precio:</label>
                      <input type="number" id="precio_actual"
                      {...formik.getFieldProps('precio_actual')}/>
                      <ErrorMessage touched={formik.touched.precio_actual} errors={formik.errors.precio_actual}/>
                  </li>
                  <input type="file" accept="image/*" id="image" name="image" onChange={(event) => {formik.setFieldValue("image", event.currentTarget.files[0].name)}} multiple={true}/>
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