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
import DropDownList from "../../components/Dropdownlist";


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const oferta = await prisma.oferta.findUnique({
      where: {
        o_id : Number(params?.id),
      },
    });

    const producto = await prisma.producto.findUnique({
        where: {
            p_id: Number(oferta.fk_producto)
        }
    })

    let feedJSON = {o_id: oferta.o_id,
        o_descripcion: oferta.o_descripcion,
        o_porcentaje_descuento: superjson.parse(superjson.stringify(oferta.o_porcentaje_descuento))+"%",
        o_fecha_inicio: new Date(oferta.o_fecha_inicio.setUTCHours(5)).toDateString(),
        o_fecha_fin: oferta.o_fecha_fin ? new Date(oferta.o_fecha_fin.setUTCHours(5)).toDateString() : null,
        fk_producto: producto.p_nombre,
    };
    const productos= await prisma.producto.findMany(
        {
          orderBy:{
            p_id: 'asc'
          }
        }
      );


    return {
      props: {feed: feedJSON, productos: productos},
    }
  };

  const updateOferta: React.FC<any> = (props) => {

    const formik = useFormik({
        initialValues:{
            o_descripcion: String(props.feed.o_descripcion),
            p_descuento: Number(props.feed.o_porcentaje_descuento), 
            fecha_inicio: '',
            fecha_fin: '',
            fk_producto: String(props.feed.fk_producto)
          },
          validationSchema: Yup.object(
            {
              o_descripcion: Yup.string().max(30, "Maximo 30 caracteres"),
              p_descuento: Yup.number().min(0, "Numero debe ser positivo").required("Obligatorio").max(100, "Descuento maximo: 100%"),
              fecha_inicio: Yup.date().required("Obligatorio"),
              fecha_fin: Yup.date().required("Obligatorio"),
              fk_producto: Yup.string().required("Obligatorio"),
            }
          ),
          onSubmit: values => {console.log(values);},
        });


    async function handleSubmit(e){
        e.preventDefault();
        console.log(superjson.stringify({o_descripcion: formik.values.o_descripcion,
            p_descuento: formik.values.p_descuento,
            fecha_inicio: formik.values.fecha_inicio,
            fecha_fin: formik.values.fecha_fin,
            fk_producto: formik.values.fk_producto,
             }));

        const response = await fetch(`/api/oferta/${props.feed.o_id}`,{method: 'POST', 
        body: superjson.stringify({o_descripcion: formik.values.o_descripcion,
                                   p_descuento: formik.values.p_descuento,
                                   fecha_inicio: formik.values.fecha_inicio,
                                   fecha_fin: formik.values.fecha_fin,
                                   fk_producto: formik.values.fk_producto,
                                    })
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
                      <label htmlFor="o_descripcion">Descripcion:</label>
                      <input type="text" id="o_descripcion"
                      {...formik.getFieldProps('o_descripcion')}/>
                      <ErrorMessage touched={formik.touched.o_descripcion} errors={formik.errors.o_descripcion}/>
                  </li>
                  <li>
                      <label htmlFor="p_descuento">Descuento:</label>
                      <input type="number" id="p_descuento"
                      {...formik.getFieldProps('p_descuento')}/> %
                      <ErrorMessage touched={formik.touched.p_descuento} errors={formik.errors.p_descuento}/>
                  </li>
                  <li>
                      <label htmlFor="fecha_inicio">Fecha inicio:</label>
                      <input type="date" id="fecha_inicio"
                      {...formik.getFieldProps('fecha_inicio')}/>
                      <ErrorMessage touched={formik.touched.fecha_inicio} errors={formik.errors.fecha_inicio}/>
                  </li>
                  <li>
                      <label htmlFor="fecha_fin">Fecha fin:</label>
                      <input type="date" id="fecha_fin"
                      {...formik.getFieldProps('fecha_fin')}/>
                      <ErrorMessage touched={formik.touched.fecha_fin} errors={formik.errors.fecha_fin}/>
                  </li>
                  <li>
                      <label htmlFor="fk_producto">Producto:</label>
                      <DropDownList content={props.productos} attValueName={"p_nombre"} objType={"producto"} name={"fk_producto"} onChange={formik.handleChange} value={formik.values.fk_producto} multiple={false}></DropDownList>
                  </li>
                  <li className="button">
                        <Button type={"submit"}variant="contained" disabled={!(formik.isValid && formik.dirty)} color={"success"}>Actualizar Oferta</Button>
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
  
  export default updateOferta;