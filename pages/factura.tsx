import React, { ReactNode } from "react";
import reactMarkdown from "react-markdown";
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../components/Layout"
import { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import Page from "../components/Page"
import Router from "next/router"
import { Formik, FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';
import styles from '../components/crud.module.css';
import DropDownList from "../components/Dropdownlist";
import { lugar } from "@prisma/client";
import ErrorMessage from "../components/ErrorMessage";
import Button from "@mui/material/Button";
import UserProfile from "./userSession";
import Axios from "axios";

const soapRequest=require('easy-soap-request');

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
          naturalIDfact: '',
          juridicoIDfact: '',
        },
        validationSchema: Yup.object(
          {
            naturalIDfact: Yup.string().max(30, 'Máximo 30 caracteres de longitud').nullable(),
            juridicoIDfact: Yup.string().max(20, 'Maximo 20 caracteres de longitud').nullable(), //.required("Obligatorio"),
          }
        ),
        onSubmit: values => {console.log(values);},
      });

//esto se encarga de convertir y descargar a pdf
      async function handleSubmit(e){
        e.preventDefault();
        if(formik.values.juridicoIDfact === '')
            formik.values.juridicoIDfact = null;
            if(formik.values.naturalIDfact === '')
                        formik.values.naturalIDfact = null;
                                console.log(`juridicoID: ${formik.values.juridicoIDfact}`);
                                console.log(`naturalID: ${formik.values.naturalIDfact}`);

     Axios.post("http://localhost:5488/api/report",
            {'template':
                {'name':'/Reportes Sweet UCAB/Factura/factura','recipe':'chrome-pdf'}  ,
            'data':
                  {"juridicoid": formik.values.juridicoIDfact,
                  "naturalid": formik.values.naturalIDfact //DIOS MIO SE LOGRÓ
                    }
            },
            {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                }
            })
            .then((res) => {
                const contentType = res.headers["content-type"];
                const blob = new Blob([res.data], {contentType} );
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'factura.pdf'); //or any other extension
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            }).catch((error) => console.log("se dio este error:"+error));
            console.log("Pasó YAY");
        //Router.back();*/
      }


    return (
        <Layout>
          <Page>
          <form  onSubmit={handleSubmit} >
              <ul>
                  <li>
                      <label htmlFor="naturalIDfact">ID (Cliente Natural):</label>
                      <input type="text" id="naturalIDfact"
                      {...formik.getFieldProps('naturalIDfact')}/>
                      <ErrorMessage touched={formik.touched.naturalIDfact} errors={formik.errors.naturalIDfact}/>
                  </li>
                  <li>
                      <label htmlFor="juridicoIDfact">ID (Cliente Juridico):</label>
                      <input type="text" id="juridicoIDfact"
                      {...formik.getFieldProps('juridicoIDfact')}/>
                      <ErrorMessage touched={formik.touched.juridicoIDfact} errors={formik.errors.juridicoIDfact}/>
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
          </Page>
        </Layout>
      )
};

export default Component;