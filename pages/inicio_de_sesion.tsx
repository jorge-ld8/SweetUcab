import reactMarkdown from "react-markdown";
import React, { ReactNode } from 'react';
import Page from "../components/Page";
import { GetStaticProps } from "next";
import { rol, usuario } from "@prisma/client";
import prisma from '../lib/prisma';
import { useFormik } from "formik";
import ErrorMessage from "../components/ErrorMessage";
import * as Yup from 'yup';
import UserProfile from "./userSession";
import Router from "next/router";

export const getStaticProps: GetStaticProps = async () => {
    const roles= await prisma.rol.findMany();
    const feed = await prisma.usuario.findMany(
      {orderBy:{
        u_id: 'asc',
      },
      select:{
          u_username: true,
          u_password: true
      }
     },
    );
    return { 
      props: { feed, roles }, 
      revalidate: 10 
    }
  }

type inicio_de_sesionProps = {
    feed: usuario[]
    roles: rol[]
}
  

//Template para crear componentes 
const Component: React.FC<inicio_de_sesionProps> = (props)=>
{
    const formik = useFormik({
        initialValues:{
          username: '',
          password: '',
        },
        validationSchema: Yup.object(
          {
              username: Yup.string()
              .test("uniqueValidation", "Username no existe en la base de datos", 
              function(value){
                  for(let p of props.feed){
                      if(p.u_username === value)
                          return true;
                  }
                  return false;
                 }),
              password: Yup.string()
              .test("uniqueValidation", "Password no coincide", 
              function(value){
                  for(let p of props.feed){
                      if(p.u_username === formik.values.username && p.u_password === value){
                        return true; 
                      }
                  }
                  return false;
                 })
          }
        ),
        onSubmit: values => {console.log(values);},
      });

      async function handleSubmit(e){
        e.preventDefault();
        let rolUsuario;
        UserProfile.setName(formik.values.username)
        for(let p of props.feed){
            if(p.u_username === formik.values.username){ //username existe
                rolUsuario = p.fk_rol
            }
        }
        UserProfile.setRol(String(rolUsuario));
        Router.back();
      }
      
    return(
        <Page navElements={[]}>
                <li>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username"
                    {...formik.getFieldProps('username')}/>
                    <ErrorMessage touched={formik.touched.username} errors={formik.errors.username}/>
                </li>
                <li>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password"
                    {...formik.getFieldProps('password')}/>
                    <ErrorMessage touched={formik.touched.password} errors={formik.errors.password}/>
                </li>
                <li className="button">
                      <button type="submit" disabled={!(formik.isValid && formik.dirty)}>Iniciar sesión</button>
              </li>
        <style jsx>
        {`
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
          `}
        </style>
        </Page>);
};

export default Component;