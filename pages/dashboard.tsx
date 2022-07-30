import React, { ReactNode } from "react";
import reactMarkdown from "react-markdown";
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../components/Layout"
import { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
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

const html= '';
const htmlnuevo = (htmll)=>{
    html=htmll.data;
  };

const Component: React.FC<Props<lugar>> = (props)=>
{
    console.log(UserProfile.getName());
    const formik = useFormik({
        initialValues:{
          fechainicial: '',
          fechafinal: '',
          tienda: '',
        },
        validationSchema: Yup.object(
          {
                        fechainicial: Yup.date().required("Obligatorio"),
                        fechafinal: Yup.date().required("Obligatorio"),
                        tienda: Yup.number().min(0, "Numero debe ser positivo"),
          }
        ),
        onSubmit: values => {console.log(values);},
      });

//esto se encarga de convertir y descargar a pdf
      async function handleSubmit(e){
        e.preventDefault();
        if(formik.values.fechainicial === '')
            formik.values.fechainicial = '07/20/2020';
            if(formik.values.fechafinal === '')
            formik.values.fechafinal = '07/30/2030';
            if(formik.values.tienda === '')
            formik.values.tienda = null;
                                console.log(`fechainicial: ${formik.values.fechainicial}`);
                                console.log(`fechafinal: ${formik.values.fechafinal}`);
                                console.log(`tienda: ${formik.values.tienda}`);

     Axios.post("http://localhost:5488/api/report",
            {'template':
                {'name':'/Reportes Sweet UCAB/Dashboard/Dashboard','recipe':'html-with-browser-client'}  ,
            'data':
                  {"fechainicio": formik.values.fechainicial,
                  "fechafin": formik.values.fechafinal, //DIOS MIO SE LOGRÓ
                  "tiendasolicitud": formik.values.tienda //recuerda q tienda puede ser null
                    }
            },
            {
                responseType: 'text',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'HTML'
                }
            })
                .then((res) => {
                  const contentType = res.headers["content-type"];
                  console.log(res.status);
                  htmlnuevo(res);
                  document.write(html);
                })
                .catch((error) => console.log(error));
            console.log("Pasó YAY");
        //Router.back();*/
      }


    return (
        <Layout>
          <form  onSubmit={handleSubmit} >
              <ul>
                  <li>
                      <label htmlFor="fechainicial">Fecha de inicio del reporte:</label>
                      <input type="date" id="fechainicial"
                      {...formik.getFieldProps('fechainicial')}/>
                      <ErrorMessage touched={formik.values.fechainicial} errors={formik.values.fechainicial}/>
                  </li>
                  <li>
                      <label htmlFor="fechafinal">Fecha de fin del reporte:</label>
                      <input type="date" id="fechafinal"
                      {...formik.getFieldProps('fechafinal')}/>
                      <ErrorMessage touched={formik.touched.fechafinal} errors={formik.errors.fechafinal}/>
                  </li>
                  <li>
                       <label htmlFor="tienda">ID de la tienda (deje en blanco para ver reporte general):</label>
                       <input type="text" id="tienda"
                       {...formik.getFieldProps('tienda')}/>
                       <ErrorMessage touched={formik.touched.tienda} errors={formik.errors.tienda}/>
                 </li>
                  <li className="Button">
                      <Button type={"submit"} variant="contained" color={"success"} disabled={!(formik.isValid && formik.dirty)}>Enviar</Button>
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

        </Layout>
      )
};

export default Component;