import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import prisma from '../lib/prisma';
import { cliente_juridico, cliente_natural, permiso, rol, usuario } from "@prisma/client"
import Router from "next/router";
import { Button, Container } from "@mui/material";
import superjson from "superjson";
import { useFormik } from "formik";
import * as Yup from 'yup';
import ErrorMessage from "../components/ErrorMessage";

  type perfilPost = {
    user: usuario
    rol: rol,
    c_juridico: cliente_juridico,
    c_natural: cliente_natural
  }
  
  const RolPost: React.FC<perfilPost> = (props) => {
    
    function handleSubmit(e){
        e.preventDefault();
        Router.push(`/consultarFabrica/${formik.values.idPedido}`);
        Router.push("#");
    }

    const formik = useFormik({
        initialValues:{
          idPedido: 0,
        },
        validationSchema: Yup.object(
          {
            idPedido: Yup.number().required("Required"), 
          }
        ),
        onSubmit: values => {console.log(values);},
      });
      

    return (
      <main>
          <form  onSubmit={handleSubmit} id="formConsulta">
            <div>  
                <label htmlFor="nombre">Introduzca el ID de la orden de pedido a la fabrica que desea consultar:</label>
                <br />
                <input type="text" id="idPedido"
                {...formik.getFieldProps('idPedido')}/>
                <ErrorMessage touched={formik.touched.idPedido} errors={formik.errors.idPedido}/>
            </div>
            <div className="Button">
                      <Button type={"submit"} variant="contained" color={"success"} disabled={!(formik.isValid && formik.dirty)}>Buscar Pedido</Button>
            </div>
          </form>
        <style jsx>{` 
          input{
            height: 2.5em;
            border-radius: 1em;
            width: 400px;
            margin: 2em;
          }

          form {
            margin: 0 auto;
          }

          label{
            width: 400px;
            margin-top: 2em;
            margin-bottom: 1.5em;
          }

          #formConsulta{
            text-align: center;
            font-size: 
          }

          .stylish{
            text-align: center;
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
        `}</style>
      </main>
    )
  }
  
  export default RolPost;