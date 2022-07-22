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
import { lugar, rol, usuario } from "@prisma/client";
import DataList from "../components/DataList";
import superjson from "superjson";
import ErrorMessage from "../components/ErrorMessage";

export const getServerSideProps: GetServerSideProps = async () => {
    const feed= await prisma.usuario.findMany();
    const roles= await prisma.rol.findMany();
    const c_juridicos = await prisma.cliente_juridico.findMany(
        {
            select: {
                c_rif: true
            }
        }
    );
    const c_naturales = await prisma.cliente_natural.findMany(
        {
            select: {
                c_cedula: true
            }
        }
    );
    const empleados = await prisma.empleado.findMany(
        {
            select: {
                e_cedula: true
            }
        }
    );
    return {
      props: {roles: roles,
              feed: feed,
              c_juridicos: c_juridicos,
              c_naturales: c_naturales,
              empleados: empleados},
    };
  }


type Props<ArbType extends Object> = {
    roles: rol[]
    feed: usuario[],
    c_juridicos: ArbType[],
    c_naturales: ArbType[],
    empleados: ArbType[]
}


const Component: React.FC<Props<rol>> = (props)=>
{
    const formik = useFormik({
        initialValues:{
          username: '',
          email: '',
          password: '',
          fk_rol: '',
          fk_c_e: '',
          fk_c_juridico: null,
          fk_c_natural: null,
          fk_empleado: null
        },
        validationSchema: Yup.object(
          {
                username: Yup.string().max(30, 'Máximo 20 caracteres de longitud').required("Obligatorio")
                //   .test("is_Unique", "Username ya existe en el sistema",   async (value) =>(findUnique()) 
                .test("uniqueValidation", "No es unico", 
                function(value){
                    for(let p of props.feed){
                        if(p.u_username === value)
                            return false;
                    }
                    return true;
                   }),
              email: Yup.string().email("Email no válido")
              .max(30, "Maximo 30 caracteres de longitud")
              .required("Obligatorio")
              .test("uniqueValidation", "No es unico",
              function(value){
               for(let p of props.feed){
                   if(p.u_email === value)
                       return false;
               }
               return true;
              }),
              password: Yup.string().max(14, "Máximo 14 caracteres de longitud").matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/, "Contraseña no válida")
              .required("Obligatorio"),
            //   fk_c_juridico: Yup.number(),
            //   fk_c_natural: Yup.number(),
            //   fk_empleado: Yup.number(),
          }
        ),
        onSubmit: values => {console.log(values);},
      });
      
  
      async function handleSubmit(e){
        e.preventDefault();
        //si la relacion es N/A pasar null
        if(formik.values.fk_rol === "N/A" || formik.values.fk_rol === "")
            formik.values.fk_rol = null;
        if(formik.values.fk_c_e === "N/A" || formik.values.fk_c_e === "")
            formik.values.fk_c_e = null;

        console.log("ROLES");
        console.log(formik.values.fk_rol);
        
        
        const response = await fetch(`/api/usuario`,{method: 'POST', 
        body: superjson.stringify({username: formik.values.username, 
                              email: formik.values.email,
                              password: formik.values.password,
                              fk_rol: formik.values.fk_rol,
                              fk_c_juridico: formik.values.fk_c_juridico,
                              fk_c_natural: formik.values.fk_c_natural,
                            })
                            });
         const data = await response.json();
         console.log(data);
         console.log(`${data}`);
        Router.back();
      }

    return (
        <Layout>
          <Page>
          <form  onSubmit={handleSubmit} >
              <ul>
              <li>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username"
                    {...formik.getFieldProps('username')}/>
                    <ErrorMessage touched={formik.touched.username} errors={formik.errors.username}/>
                </li>
                <li>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email"
                    {...formik.getFieldProps('email')}/>
                    <ErrorMessage touched={formik.touched.email} errors={formik.errors.email}/>
                </li>
                <li>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password"
                    {...formik.getFieldProps('password')}/>
                    <ErrorMessage touched={formik.touched.password} errors={formik.errors.password}/>
                </li>
                <li>
                    <label htmlFor="relacion">Elija un rol:</label>
                    <DropDownList content={props.roles} attValueName={"r_tipo"} objType={"rol"} name={"fk_rol"} onChange={formik.handleChange} value={formik.values.fk_rol}/>
                </li>
                <li>
                    <fieldset {...formik.getFieldProps('fk_c_e')}>
                        <legend>Elija que tipo de cliente es</legend>
                        <input type="radio" id="cliente_juridico" name="fk_c_e" value={"cliente_juridico"}/>
                        <label htmlFor="cliente_juridico">Cliente Juridico</label> <br/>
                        <input type="radio" id="cliente_natural" name="fk_c_e" value={"cliente_natural"}/>
                        <label htmlFor="cliente_natural">Cliente Natural</label>
                        <input type="radio" id="empleado" name="fk_c_e" value={"empleado"}/>
                        <label htmlFor="empleado">Empleado</label>
                    </fieldset>
                </li>
                <li>
                    { formik.values.fk_c_e === "cliente_juridico" ? 
                    (<DataList content={props.c_juridicos} attValueName={"c_rif"} objType={"cliente_juridico"} name={"fk_c_juridico"} onChange={formik.handleChange} value={formik.values.fk_c_juridico}
                      message={"Introduzca su RIF: "}></DataList>)
                    :
                    ( formik.values.fk_c_e === "cliente_natural" ? 
                        (<DataList content={props.c_naturales} attValueName={"c_cedula"} objType={"cliente_natural"} name={"fk_c_natural"} onChange={formik.handleChange} value={formik.values.fk_c_natural}
                        message={"Introduzca su cédula: "}></DataList>) 
                        : 
                        (<DataList content={props.empleados} attValueName={"e_cedula"} objType={"empleado"} name={"fk_empleado"} onChange={formik.handleChange} value={'hola'}
                        message={"Introduzca su cédula: "}></DataList>)
                    )    
                }
                </li>
                  <li className="button">
                      <button type="submit" disabled={!(formik.isValid && formik.dirty)}>Crear</button>
                  </li>
              </ul>
          </form>
          <style jsx>{`
                  fieldset label{
                    display: inline-block;
                    width: 200pxx;
                    text-align: center;
                    margin-right: .5em;
                  }

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

            fieldset{
                border: 0;
                display: flex;
                align-items: flex-start;
                margin: 0 auto;
                text-align: center;
            }

            fieldset label {
                margin-right: 10px;
                line-height: 2.2rem;
            }
            
            fieldset input {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
            
                border-radius: 50%;
                width: 16px;
                height: 16px;
            
                border: 2px solid #999;
                transition: 0.2s all linear;
                margin-right: 0px;
            
                position: relative;
                top: 4px;
            }
            fieldset input:checked {
                border: 6px solid black;
              }
            fieldset button:hover,
            fieldset button:focus {
                color: #999;
              }
          `}</style>
          </Page>
        </Layout>
      )
};

export default Component;
