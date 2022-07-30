import React, { ReactNode } from "react";
import reactMarkdown from "react-markdown";
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../components/Layout"
import { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import Router from "next/router";
import { Formik, FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';
import styles from '../components/crud.module.css';
import DropDownList from "../components/Dropdownlist";
import { lugar } from "@prisma/client";
import ErrorMessage from "../components/ErrorMessage";
import Button from "@mui/material/Button";
import UserProfile from "./userSession";

export const getServerSideProps: GetServerSideProps = async () => {
    const feed = await prisma.lugar.findMany();
    return {
      props: {feed},
    }
  }

type Props<ArbType extends Object> = {
    feed: ArbType[]
}
  

const Component: React.FC<Props<lugar>> = (props)=>
{
    console.log(UserProfile.getName());
    const formik = useFormik({
        initialValues:{
          descripcion: '',
          tipo: '',
          relacion: '',
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
        console.log(`Relacion: ${formik.values.relacion}`);
        if(formik.values.relacion === 'N/A') 
            formik.values.relacion = null;
        const response = await fetch(`/api/lugar`,{method: 'POST', 
        body: JSON.stringify({descripcion: formik.values.descripcion,
                              tipo: formik.values.tipo,
                              relacion: formik.values.relacion})
        }).then(response =>{ 
          if(response.ok)
            return response.json()
          }
        ).catch(e => console.error(e))
        console.log(response);
        Router.back();
      }
  

    return (
        <main>
          <form  onSubmit={handleSubmit} >
              <ul>
                  <li>
                      <label htmlFor="descripcion">Descripcion:</label>
                      <input type="text" id="descripcion"
                      {...formik.getFieldProps('descripcion')}/>
                      <ErrorMessage touched={formik.touched.descripcion} errors={formik.errors.descripcion}/>
                  </li>
                  <li>
                      <label htmlFor="tipo">Tipo:</label>
                      <input type="text" id="tipo"
                      {...formik.getFieldProps('tipo')}/>
                      <ErrorMessage touched={formik.touched.tipo} errors={formik.errors.tipo}/>
                  </li>
                  <li>
                    <label htmlFor="relacion">Elija un lugar con el que tiene relacion:</label>
                    <DropDownList content={props.feed} attValueName={"l_descripcion"} objType={"lugar"} name={"relacion"} onChange={formik.handleChange} value={formik.values.relacion}/>
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
    
            Button {
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
          </main>
      )
};

export default Component;