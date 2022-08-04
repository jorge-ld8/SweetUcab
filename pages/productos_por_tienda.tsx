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
    const feed = await prisma.tienda.findMany(
    {orderBy:{
          t_id: 'asc',
        },
        select:{
            t_id: true,
            t_nombre: true,
        }});
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
          }
        ),
        onSubmit: values => {console.log(values);},
      });

//esto se encarga de convertir y renderizar
      async function handleSubmit(e){
        e.preventDefault();
        var tienda=null;
            if(formik.values.tienda == 'N/A')
            {document.getElementById("descripcion").textContent="Seleccione una tienda.";
            return;}
            else{for(var a=0; a<=props.feed.length-1; a++){
                        if (formik.values.tienda==props.feed[a].t_nombre){
                                    console.log("existe la tienda");
                                    console.log("prop:", props.feed[a].t_nombre);
                                    tienda=props.feed[a].t_id;
                                    }}}
                                 console.log(`tienda:`, tienda);



     Axios.post("http://localhost:5488/api/report",
            {'template':
                {'name':'/Reportes Sweet UCAB/Productos por tienda/pptienda','recipe':'html-with-browser-client'}  ,
            'data':
                  {"tiendasolicitud": tienda //recuerda q tienda puede ser null
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
        <h3>PRODUCTOS POR TIENDA</h3>
        <h4 id="descripcion"></h4>
          <form  onSubmit={handleSubmit} >
              <ul>
                  <li>
                       <label htmlFor="tienda">ID de la tienda:</label>
                       <DropDownList content={props.feed} attValueName={"t_nombre"} objType={"tienda"} name={"tienda"} onChange={formik.handleChange} value={formik.values.tienda}/>
                                       </li>
                  <li className="Button">
                      <Button type={"submit"} variant="contained" color={"success"} >Enviar</Button>
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