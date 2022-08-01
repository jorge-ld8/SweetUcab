import React, { ReactNode } from "react";
import reactMarkdown from "react-markdown";
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../components/Layout"
import { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
//import Page from "../components/Page"
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
    const feed = await prisma.transaccion_compra.findMany(
    {orderBy:{
              t_id: 'asc',
            },
            select:{
                t_id: true,
                fk_cliente_natural: true,
                fk_cliente_juridico: true,
            }}
    );
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
          transaccion: '',
        },
        onSubmit: values => {console.log(values);},
      });

//esto se encarga de convertir y descargar a pdf
      async function handleSubmit(e){
      var juridicoid=0;
      var naturalid=0;
        e.preventDefault();
        if (formik.values.transaccion=='N/A'){
        document.getElementById("descripcion").textContent="Por favor seleccione un ID válido.";
                 return;
        }

        for(var a=0; a<=props.feed.length-1; a++){
        if (formik.values.transaccion==props.feed[a].t_id){
        console.log("existe la transaccion");
        console.log("prop:", props.feed[a].t_id);
        if (props.feed[a].fk_cliente_juridico==null){
              var juridicoid=null;
              var naturalid=props.feed[a].fk_cliente_natural;
        }
        if (props.feed[a].fk_cliente_natural==null){
                              var naturalid=null;
                              var juridicoid=props.feed[a].fk_cliente_juridico;
                        }
         }}

        console.log("natural:"+naturalid+",juridico:"+juridicoid);

    Axios.post("http://localhost:5488/api/report",
            {'template':
                {'name':'/Reportes Sweet UCAB/Orden Despacho/ordendespacho','recipe':'chrome-pdf'}  ,
            'data':
                  {"juridicoid": juridicoid,
                  "naturalid": naturalid //DIOS MIO SE LOGRÓ
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
                link.setAttribute('download', 'orden-despacho.pdf'); //or any other extension
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            }).catch((error) => console.log("se dio este error:"+error));
            console.log("Pasó YAY");
        //Router.back();*/
      }


    return (
        <Layout>
        <h3>ORDEN DE DESPACHO</h3>
        <h4 id="descripcion"></h4>

          <form  onSubmit={handleSubmit} >
              <ul>
                  <li>
                      <label htmlFor="tienda">ID de la transacción:</label>
                      <DropDownList content={props.feed} attValueName={"t_id"} objType={"transaccion_compra"} name={"transaccion"} onChange={formik.handleChange} value={formik.values.transaccion}/>
                     </li>
                  <li className="Button">
                      <Button type={"submit"} variant="contained" color={"success"} disabled={!(formik.isValid && formik.dirty)}>Descargar orden de despacho</Button>
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