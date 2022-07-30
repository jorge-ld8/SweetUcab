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
import superjson from "superjson";

const soapRequest=require('easy-soap-request');

export const getServerSideProps: GetServerSideProps = async () => {
    const feed = await prisma.lugar.findMany();
    const flyers = await prisma.flyer.findMany(
          {
          select:{f_id:true,},
            orderBy:{
              f_id: 'asc'
            }
          }
        );

    return {
      props: {feed, flyers},
    }
  }

type Props<ArbType extends Object> = {
    feed: ArbType[],
    permisos: permiso[]
}

Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};


const Component: React.FC<Props<lugar>> = (props)=>
{
    console.log(UserProfile.getName());
    const formik = useFormik({
        initialValues:{
          flyerid: '',
        },
        validationSchema: Yup.object(
          {
            flyerid: Yup.array().required()}
        ),
        onSubmit: values => {console.log(values);},
      });

//esto se encarga de convertir y descargar a pdf
      async function handleSubmit(e){
        e.preventDefault();
        if (formik.values.flyerid==='N/A'){
        var size = Object.size(props.flyers);
        formik.values.flyerid=size;}
    console.log(`flyerid: ${formik.values.flyerid}`);
     Axios.post("http://localhost:5488/api/report",
            {'template':
                {'name':'/Reportes Sweet UCAB/Flyer/Flyer','recipe':'chrome-pdf'}  ,
            'data':
                  {"flyerid": formik.values.flyerid,
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
                link.setAttribute('download', 'flyer-sweet.pdf'); //or any other extension
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            }).catch((error) => console.log("se dio este error:"+error));
            console.log("Pasó YAY");
        //Router.back();*/
      }


    return (
        <Layout>

          <form  onSubmit={handleSubmit} >
              <ul>
                  <li>
                      <label htmlFor="flyerid">Seleccione el flyer a descargar (N/A retorna el más reciente): </label>
                      <DropDownList content={props.flyers} attValueName={"f_id"} objType={"flyer"} name={"flyerid"} onChange={formik.handleChange} value={formik.values.flyerid} multiple={false}/>
                  </li>

                  <li className="Button">
                      <Button type={"submit"} variant="contained" color={"success"} disabled={!(formik.dirty)}>Crear</Button>
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