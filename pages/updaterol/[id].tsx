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
import { rol, usuario } from "@prisma/client"
import ErrorMessage from "../../components/ErrorMessage";


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const rol = await prisma.rol.findUnique({
      where: {
        r_id : Number(params?.id),
      },
    });
    return {
      props: rol,
    }
  }


  
  const RolPost: React.FC<rol> = (props) => {
    const formik = useFormik({
      initialValues:{
        descripcion: props.r_descripcion,
        tipo: props.r_tipo,
      },
      validationSchema: Yup.object(
        {
            descripcion: Yup.string().max(30, 'Máximo 30 caracteres de longitud').required("Obligatorio"),
            tipo: Yup.string().max(20, 'Maximo 20 caracteres de longitud').required("Obligatorio"),
        }
      ),
      onSubmit: values => {console.log(values);},
    });


    async function handleSubmit(e){
      e.preventDefault();
      const response = await fetch(`/api/rol/${props.r_id}`,{method: 'POST', 
      body: JSON.stringify({descripcion: formik.values.descripcion, 
                            tipo: formik.values.tipo})
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
                <label htmlFor="tipo">Tipo:</label>
                <input type="text" id="tipo"
                {...formik.getFieldProps('tipo')}/>
                <ErrorMessage touched={formik.touched.tipo} errors={formik.errors.tipo}/>
            </li>
            <li>
                <label htmlFor="descripcion">Descripcion:</label>
                <input type="text" id="descripcion"
                {...formik.getFieldProps('descripcion')}/>
                <ErrorMessage touched={formik.touched.descripcion} errors={formik.errors.descripcion}/>
            </li>
            <li className="button">
                <button type="submit" disabled={!(formik.isValid && formik.dirty)}>Actualizar</button>
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
  
  export default RolPost;