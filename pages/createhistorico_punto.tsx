import React, { ReactNode } from "react";
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import prisma from '../lib/prisma';
import Page from "../components/Page"
import Router from "next/router"
import { Formik, FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';
import styles from '../components/crud.module.css';
import { lugar, permiso, rol } from "@prisma/client";
import ErrorMessage from "../components/ErrorMessage";
import DropDownList from "../components/Dropdownlist";
import Button from "@mui/material/Button";
import superjson from "superjson";

export const getServerSideProps: GetServerSideProps = async () => {
    return {
      props: {},
    }
  }

type Props = {
    feed: rol[],
    permisos: permiso[]
}
  

const NewRole: React.FC<Props> = (props)=>
{

    const formik = useFormik({
        initialValues:{
          valor: 0,
        },
        validationSchema: Yup.object(
          {
            valor: Yup.number().min(0, "Numero debe ser positivo").required("Obligatorio")
          }
        ),
        onSubmit: values => {console.log(values);},
      });
      
  
      async function handleSubmit(e){
        e.preventDefault();
        console.log(JSON.stringify(formik.values.valor));
        const response = await fetch(`/api/historico_punto`,{method: 'POST', 
        body: superjson.stringify({h_valor: formik.values.valor,})
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
                      <label htmlFor="valor">Nuevo Valor del punto:</label>
                      <input type="number" id="valor"
                      {...formik.getFieldProps('valor')}/>
                      <ErrorMessage touched={formik.touched.valor} errors={formik.errors.valor}/>
                  </li>
                  <li className="button">
                        <Button type={"submit"}variant="contained" disabled={!(formik.isValid && formik.dirty)} color={"success"}>Crear Punto</Button>
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

export default NewRole;