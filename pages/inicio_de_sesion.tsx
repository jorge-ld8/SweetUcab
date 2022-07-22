import React, { ReactNode } from 'react';
import Page from "../components/Page";
import { GetStaticProps } from "next";
import { permiso, permiso_rol, rol, usuario } from "@prisma/client";
import prisma from '../lib/prisma';
import { useFormik } from "formik";
import ErrorMessage from "../components/ErrorMessage";
import * as Yup from 'yup';
import UserProfile from "./userSession";
import Router from "next/router";
import Layout from "../components/Layout";
import {Button} from '@mui/material';

export const getStaticProps: GetStaticProps = async () => {
    const roles = await prisma.rol.findMany();
    const usuarios = await prisma.usuario.findMany({
      select:{
          u_username: true,
          u_password: true,
          fk_rol: true
      }
     },
    );
    const permisos_roles = await prisma.permiso_rol.findMany();
    const permisos = await prisma.permiso.findMany();
    return { 
      props: { usuarios, roles, permisos_roles, permisos }, 
      revalidate: 10 
    }
  }

type inicio_de_sesionProps = {
    usuarios: usuario[]
    roles: rol[]
    permisos_roles: permiso_rol[]
    permisos: permiso[]
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
                  for(let p of props.usuarios){
                      if(p.u_username === value)
                          return true;
                  }
                  return false;
                 }),
              password: Yup.string()
              .test("uniqueValidation", "Password no coincide", 
              function(value){
                  for(let p of props.usuarios){
                      if(p.u_username === formik.values.username && p.u_password === value){
                        return true
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
        let rolUsuarioPermisos = [];
        UserProfile.setName(formik.values.username)
        for(let usuario of props.usuarios){
            if(usuario.u_username === formik.values.username){ //username existe
                let rolID = usuario.fk_rol;
                for(let permiso_rol of props.permisos_roles){ //relacion permisos y roles
                    if(permiso_rol.fk_rol === rolID){
                        let permisoID = permiso_rol.fk_permiso;
                        for(let permiso of props.permisos){
                            if(permiso.p_id === permisoID)
                                rolUsuarioPermisos.push(permiso.p_tipo);
                        }
                    }
                }
            }
        }
        UserProfile.setRol(rolUsuarioPermisos);
        UserProfile.setName(formik.values.username);
        Router.back();
      }
      
    return(
            <Layout>
                <Page>
                        <h3>INICIO DE SESION</h3>
                        <form onSubmit={handleSubmit}>
                            <ul>
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
                                   <Button type={"submit"}variant="contained" disabled={!(formik.isValid && formik.dirty)} color={"success"}>Iniciar Sesión</Button>
                                </li>
                            </ul>
                        </form>
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
                </Page>
            </Layout>);
};

export default Component;