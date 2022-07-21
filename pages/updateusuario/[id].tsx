import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import prisma from '../../lib/prisma';
import Page from "../../components/Page"
import Router from "next/router"
import { Formik, useFormik } from "formik";
import * as Yup from 'yup';
import styles from '../../components/crud.module.css';
import { usuario } from "@prisma/client"


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const feed = await prisma.usuario.findMany();
    const usuario = await prisma.usuario.findUnique({
      where: {
        u_id : Number(params?.id),
      },
    });
    return {
      props: {
        usuario: usuario,
        feed: feed
    }
  }
}
  
  type LugarPostProps = {
    feed: usuario[],
    usuario: usuario
  }

  const LugarPost: React.FC<LugarPostProps> = (props) => {
    const navElements = [{link:"#", title:"Link 1"},
    {link:"#", title:"Link 2"},
    {link:"#", title:"Link 3"}];

    const formik = useFormik({
      initialValues:{
        username: props.usuario.u_username,
        email: props.usuario.u_email,
        password: props.usuario.u_password,
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
          email: Yup.string().email("Email no válido").max(30, "Maximo 30 caracteres de longitud").required("Obligatorio")
          .test("uniqueValidation", "No es unico", 
          function(value){
              for(let p of props.feed){
                  if(p.u_email === value)
                      return false;
              }
              return true;
             })
             ,
          password: Yup.string().max(14, "Máximo 14 caracteres de longitud").matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/, "Contraseña no válida").required("Obligatorio")
        }
      ),
      onSubmit: values => {console.log(values);},
    });


    async function handleSubmit(e){
      e.preventDefault();
      const response = await fetch(`/api/usuario/${props.usuario.u_id}`,{method: 'POST', 
      body: JSON.stringify({username: formik.values.username, 
                            email: formik.values.email,
                            password: formik.values.password})
      });
      const data = await response.json();
      console.log(data);
      Router.back();
    }

    return (
      <Layout>
        <Page navElements={navElements}>
        <form  onSubmit={handleSubmit} >
            <ul>
                <li>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username"
                    {...formik.getFieldProps('username')}/>
                    {formik.touched.username && formik.errors.username ? (
                      <div className={styles.errorMessage}>{formik.errors.username}</div>
                    ) : null}
                </li>
                <li>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email"
                    {...formik.getFieldProps('email')}/>
                    {formik.touched.email && formik.errors.email ? (
                      <div className={styles.errorMessage}>{formik.errors.email}</div>
                    ) : null}
                </li>
                <li>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password"
                    {...formik.getFieldProps('password')}/>
                    {formik.touched.password && formik.errors.password ? (
                      <div className={styles.errorMessage}>{formik.errors.password}</div>
                    ) : null}
                </li>
                <li className="button">
                    <button type="submit" disabled={!(formik.isValid && formik.dirty)}>Actualizar</button>
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

          form div{
            margin: .5em;
          }
        `}</style>
        </Page>
      </Layout>
    )
  }
  
  export default LugarPost;