import React, { ReactNode } from "react";
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import prisma from '../lib/prisma';
import Router from "next/router";
import { Formik, FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';
import { cliente_juridico, lugar, producto, tienda } from "@prisma/client";
import ErrorMessage from "../components/ErrorMessage";
import Button from "@mui/material/Button";
import { FileUploadButton } from "../components/FileUploadButton";
import DropDownList from "../components/Dropdownlist";
import superjson from "superjson";

export const getServerSideProps: GetServerSideProps = async () => {
    const feed = await prisma.tienda.findMany();
    const c_juridicos = await prisma.cliente_juridico.findMany();
    return {
      props: {feed, c_juridicos: c_juridicos},
    }
  }

type Props = {
    feed: tienda[]
    c_juridicos: cliente_juridico[]
}

const Component: React.FC<Props> = (props)=>
{
    const formik = useFormik({
        initialValues:{
          rif: '',
          razon_social: '',
          denom_comercial: '',
          capital_disponible: 0,
          direccion: '',
          direccion_fiscal_ppal: '',
          pagina_web: '',
          tienda: ''
        },
        validationSchema: Yup.object(
          {
            rif: Yup.string().required("Obligatorio").matches(/^[VJEPG]{1}-[0-9]{8}$/, "RIF no válido")
            .test("uniqueValidation", "No es unico", 
            function(value){
                for(let p of props.c_juridicos){
                    if(p.c_rif === value)
                        return false;
                }
                return true;
               }),
            razon_social: Yup.string().required("Obligatorio").max(30, "Máximo 30 caracteres"),
            denom_comercial: Yup.string().required("Obligatorio").max(30, "Máximo 30 caracteres"),
            capital_disponible: Yup.number().required("Obligatorio").min(0, "Debe ser un número positivo"),
            direccion: Yup.string().required("Obligatorio").max(50, "Máximo 50 caraceres"),
            direccion_fiscal_ppal: Yup.string().required("Obligatorio").max(50, "Máximo 50 caracteres"),
            pagina_web: Yup.string().required("Obligatorio").max(60, "Máximo 60 caracteres")
            .test("uniqueValidation", "No es unico", 
            function(value){
                for(let p of props.c_juridicos){
                    if(p.c_pagina_web === value)
                        return false;
                }
                return true;
               })
            ,
            tienda: Yup.string().required("Obligatorio")
         }
        ),
        onSubmit: values => {console.log(values);},
      });
      
      async function handleSubmit(e){
        e.preventDefault();
        console.log(JSON.stringify({
            rif: formik.values.rif,
            razon_social: formik.values.razon_social,
            denom_comercial: formik.values.denom_comercial,
            capital_disponible: formik.values.capital_disponible,
            direccion: formik.values.direccion,
            direccion_fiscal_ppal: formik.values.direccion_fiscal_ppal,
            pagina_web: formik.values.pagina_web,
            tienda: formik.values.tienda
        }));

            
        const response = await fetch(`/api/cliente_juridico`,{method: 'POST',         
        body:   JSON.stringify({rif: formik.values.rif,
                razon_social: formik.values.razon_social,
                denom_comercial: formik.values.denom_comercial,
                capital_disponible: formik.values.capital_disponible,
                direccion: formik.values.direccion,
                direccion_fiscal_ppal: formik.values.direccion_fiscal_ppal,
                pagina_web: formik.values.pagina_web,
                tienda: formik.values.tienda})
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
                      <label htmlFor="rif">RIF:</label>
                      <input type="text" id="rif"
                      {...formik.getFieldProps('rif')}/>
                      <ErrorMessage touched={formik.touched.rif} errors={formik.errors.rif}/>
                  </li>
                  <li>
                      <label htmlFor="razon_social">Razon social:</label>
                      <input type="text" id="razon_social"
                      {...formik.getFieldProps('razon_social')}/>
                      <ErrorMessage touched={formik.touched.razon_social} errors={formik.errors.razon_social}/>
                  </li>
                  <li>
                      <label htmlFor="denom_comercial">Denominación comercial:</label>
                      <input type="text" id="denom_comercial"
                      {...formik.getFieldProps('denom_comercial')}/>
                      <ErrorMessage touched={formik.touched.denom_comercial} errors={formik.errors.denom_comercial}/>
                  </li>
                  <li>
                      <label htmlFor="capital_disponible">Capital Disponible:</label>
                      <input type="number" id="capital_disponible"
                      {...formik.getFieldProps('capital_disponible')}/>
                      <ErrorMessage touched={formik.touched.capital_disponible} errors={formik.errors.capital_disponible}/>
                  </li>
                  <li>
                      <label htmlFor="direccion">Direccion:</label>
                      <input type="text" id="direccion"
                      {...formik.getFieldProps('direccion')}/>
                      <ErrorMessage touched={formik.touched.direccion} errors={formik.errors.direccion}/>
                  </li>
                  <li>
                      <label htmlFor="direccion_fiscal_ppal">Direccion Fiscal Principal:</label>
                      <input type="text" id="direccion_fiscal_ppal"
                      {...formik.getFieldProps('direccion_fiscal_ppal')}/>
                      <ErrorMessage touched={formik.touched.direccion_fiscal_ppal} errors={formik.errors.direccion_fiscal_ppal}/>
                  </li>
                  <li>
                      <label htmlFor="pagina_web">Pagina Web:</label>
                      <input type="text" id="pagina_web"
                      {...formik.getFieldProps('pagina_web')}/>
                      <ErrorMessage touched={formik.touched.pagina_web} errors={formik.errors.pagina_web}/>
                  </li>
                  <li>
                      <label htmlFor="tienda">Tienda a la que pertenece:</label>
                      <DropDownList content={props.feed} attValueName={"t_nombre"} objType={"tienda"} name={"tienda"} onChange={formik.handleChange} value={formik.values.tienda}/>
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
          </main>
      )
};

export default Component;