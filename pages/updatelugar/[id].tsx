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


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const lugar = await prisma.lugar.findUnique({
      where: {
        l_id : Number(params?.id),
      },
    });
    return {
      props: lugar,
    }
  }
  
  const LugarPost: React.FC<PostProps> = (props) => {
    var classNames = require('classnames');

    const navElements = [{link:"#", title:"Link 1"},
    {link:"#", title:"Link 2"},
    {link:"#", title:"Link 3"}];

    const formik = useFormik({
      initialValues:{
        descripcion: props.l_descripcion,
        tipo: props.l_tipo,
      },
      validationSchema: Yup.object(
        {
          descripcion: Yup.string().max(30, 'Máximo 30 caracteres de longitud'),
          tipo: Yup.string().max(20, 'Maximo 20 caracteres de longitud'),
        }
      ),
      onSubmit: values => {console.log(values);},
    });


    async function handleSubmit(e){
      e.preventDefault();
      const response = await fetch(`/api/lugar/${props.l_id}`,{method: 'POST', 
      body: JSON.stringify({descripcion: formik.values.descripcion, 
                            tipo: formik.values.tipo})
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
                    <label htmlFor="descripcion">Descripcion:</label>
                    <input type="text" id="descripcion"
                    {...formik.getFieldProps('descripcion')}/>
                    {formik.touched.descripcion && formik.errors.descripcion ? (
                      <div className={styles.errorMessage}>{formik.errors.descripcion}</div>
                    ) : null}
                </li>
                <li>
                    <label htmlFor="tipo">Tipo:</label>
                    <input type="text" id="tipo"
                    {...formik.getFieldProps('tipo')}/>
                    {formik.touched.tipo && formik.errors.tipo ? (
                      <div className={styles.errorMessage}>{formik.errors.tipo}</div>
                    ) : null}
                </li>
                <li className="button">
                    <button type="submit">Actualizar</button>
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