import React, { ReactNode } from "react";
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import prisma from '../lib/prisma';
import Page from "../components/Page"
import Router from "next/router"
import { Formik, FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';
import { lugar, permiso, rol } from "@prisma/client";
import ErrorMessage from "../components/ErrorMessage";
import Button from "@mui/material/Button";
import DropDownList from "../components/Dropdownlist";

export const getServerSideProps: GetServerSideProps = async () => {
    const feed = await prisma.rol.findMany();
    const permisos = await prisma.permiso.findMany(
      {
        orderBy:{
          p_id: 'asc'
        }
      }
    );
    return {
      props: {feed, permisos},
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
          descripcion: '',
          tipo: '',
          relacion: '',
        },
        validationSchema: Yup.object(
          {
            descripcion: Yup.string().max(30, 'Máximo 30 caracteres de longitud').required("Obligatorio"),
            tipo: Yup.string().max(20, 'Maximo 20 caracteres de longitud').required("Obligatorio"),
            relacion: Yup.array().required()
          }
        ),
        onSubmit: values => {console.log(values);},
      });
      
  
      async function handleSubmit(e){
        e.preventDefault();
        const response = await fetch(`/api/rol`,{method: 'POST', 
        body: JSON.stringify({descripcion: formik.values.descripcion, 
                              tipo: formik.values.tipo,
                              relacion: formik.values.relacion,})
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
                  <li>
                    <label htmlFor="relacion">Seleccione los permisos del rol: </label>
                    <DropDownList content={props.permisos} attValueName={"p_tipo"} objType={"rol"} name={"relacion"} onChange={formik.handleChange} value={formik.values.relacion} multiple={true}/>
                  </li>
                  <li className="Button">
                      <Button type={"submit"} variant="contained" color={"success"}  disabled={!(formik.isValid && formik.dirty)}>Crear</Button>
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