import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import prisma from '../../lib/prisma';
import Page from "../../components/Page"
import Router from "next/router"
import { Formik, useFormik } from "formik";
import * as Yup from 'yup';
import styles from '../../components/crud.module.css';
import { producto } from "@prisma/client"
import ErrorMessage from "../../components/ErrorMessage";


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const producto = await prisma.producto.findUnique({
      where: {
        p_id : Number(params?.id),
      },
    });
    return {
      props: producto,
    }
  }


  
  const ProductoPost: React.FC<producto> = (props) => {
    const navElements = [{link:"#", title:"Link 1"},
    {link:"#", title:"Link 2"},
    {link:"#", title:"Link 3"}];

    const formik = useFormik({
        initialValues:{
          nombre: props.p_nombre,
          descripcion: props.p_descripcion,
          peso: props.p_peso,
          precio_actual: props.p_peso
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
            precio_actual: formik.values.precio_actual}));

            
        const response = await fetch(`/api/producto/${props.p_id}`,{method: 'POST',         
        body: JSON.stringify({descripcion: formik.values.descripcion, 
                              nombre: formik.values.nombre,
                              peso: formik.values.peso,
                              precio_actual: formik.values.precio_actual})
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
          <Page navElements={navElements}>
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
                  <li className="button">
                      <button type="submit" disabled={!(formik.isValid && formik.dirty)}>Crear</button>
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

          form div{
            margin: .5em;
          }
        `}</style>
        </Page>
      </Layout>
    )
  }
  
  export default ProductoPost;