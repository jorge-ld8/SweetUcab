import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import prisma from '../../lib/prisma';
import Page from "../../components/Page"
import Router from "next/router"
import { Formik, useFormik } from "formik";
import * as Yup from 'yup';
import styles from '../../components/crud.module.css';
import { historico_punto } from "@prisma/client";
import ErrorMessage from "../../components/ErrorMessage";
import { parse, isDate } from "date-fns";
import Button from "@mui/material/Button";
import superjson from "superjson";


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const h_punto = await prisma.historico_punto.findUnique({
      where: {
        h_id : Number(params?.id),
      },
    });

    let feedJSON = {
      h_id: h_punto.h_id, 
      h_valor: superjson.parse(superjson.stringify(h_punto.h_valor)), 
      h_fecha_emision: h_punto.h_fecha_emision.toDateString(), 
      h_fecha_final: h_punto.h_fecha_final ? h_punto.h_fecha_final.toDateString(): null
    }

    return {
      props: feedJSON,
    }
  };

  const updateHistoricoPunto: React.FC<any> = (props) => {

    function parseDateString(value, originalValue) {
        const parsedDate = isDate(originalValue)
          ? originalValue
          : parse(originalValue, "yyyy-MM-dd", new Date());
      
        return parsedDate;
      }

    const formik = useFormik({
      initialValues:{
        valor: Number(props.h_valor),
        fecha_inicio: String(props.h_fecha_emision),
        fecha_final: ''
      },
      validationSchema: Yup.object(
        {
            valor: Yup.number().min(0, "Número positivo").required("Obligatorio"),
            fecha_inicio: Yup.date().required("Obligatorio").transform(parseDateString).max(new Date(), "Máxima fecha es hoy"),
            fecha_final: Yup.date().transform(parseDateString).min(new Date(), "Mínima fecha es hoy")
        }
      ),
      onSubmit: values => {console.log(values);},
    });


    async function handleSubmit(e){
      e.preventDefault();
      console.log(superjson.stringify({valor: formik.values.valor, 
        fecha_inicio: formik.values.fecha_inicio,
        fecha_final: formik.values.fecha_final}));
      
      const response = await fetch(`/api/historico_punto/${props.h_id}`,{method: 'POST', 
      body: superjson.stringify({valor: formik.values.valor, 
                            fecha_inicio: formik.values.fecha_inicio,
                            fecha_final: formik.values.fecha_final})
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
                    <label htmlFor="valor">Valor:</label>
                    <input type="number" id="valor"
                    {...formik.getFieldProps('valor')}/>
                    <ErrorMessage touched={formik.touched.valor} errors={formik.errors.valor}/>
                </li>
                <li>
                    <label htmlFor="fecha_inicio">Fecha inicio: </label>
                    <input type="date" id="fecha_inicio"
                    {...formik.getFieldProps('fecha_inicio')}/>
                    <ErrorMessage touched={formik.touched.fecha_inicio} errors={formik.errors.fecha_inicio}/>
                </li>
                <li>
                    <label htmlFor="fecha_final">Fecha final:</label>
                    <input type="date" id="fecha_final"
                    {...formik.getFieldProps('fecha_final')}/>
                    <ErrorMessage touched={formik.touched.fecha_final} errors={formik.errors.fecha_final}/>
                </li>
                <li className="button">
                    <Button type={"submit"}variant="contained" disabled={!(formik.isValid && formik.dirty)} color={"success"}>Editar Punto</Button>
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
  
  export default updateHistoricoPunto;