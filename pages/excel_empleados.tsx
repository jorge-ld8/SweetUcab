import React, { ReactNode } from "react";
import reactMarkdown from "react-markdown";
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../components/Layout"
import { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import Router from "next/router"
import { Formik, FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';
import styles from '../components/crud.module.css';
import DropDownList from "../components/Dropdownlist";
import { lugar } from "@prisma/client";
import ErrorMessage from "../components/ErrorMessage";
import Button from "@mui/material/Button";
import UserProfile from "./userSession";
import Axios from "axios";
import xlsx from 'node-xlsx';
import * as fs from 'node:fs';
import superjson from "superjson";
import { read, writeFileXLSX } from "./xlsx.mjs";

const soapRequest=require('easy-soap-request');

export const getServerSideProps: GetServerSideProps = async () => {
    const feed = await prisma.lugar.findMany();
    return {
      props: {feed},
    }
  }

type Props<ArbType extends Object> = {
    feed: ArbType[]
}

const counter=0;
const html= '';
const htmlnuevo = (htmll)=>{
    html=htmll.data;
  };

const Component: React.FC<Props<lugar>> = (props)=>
{
    console.log(UserProfile.getName());
    const formik = useFormik({
        initialValues:{
          fechainicial: '',
          fechafinal: '',
        },
        validationSchema: Yup.object(
          {
          }
        ),
        onSubmit: values => {console.log(values);},
      });

      //retorna la n ocurrencia de algo en un string
      function nthIndex(str, pat, n){
          var L= str.length, i= -1;
          while(n-- && i++<L){
              i= str.indexOf(pat, i);
              if (i < 0) break;
          }
          return i;
      };

//TODO ESTO permite convertir el excel a un string con formato json
      function cambioFile(){
                            const input = document.getElementById('inputFileServer');
                            if(input.files && input.files[0]){
                                console.log("File Seleccionado : ", input.files[0]);
                                return input.files[0];}

                            else console.log("Sin Archivo Seleccionado ");
                        };

                        function excelFileToJSON(file){
                            try {
                            var XLSX = require('xlsx');
                              var reader = new FileReader();
                              reader.readAsBinaryString(file);
                              reader.onload = function(e) {

                                  var data = e.target.result;
                                  var workbook = XLSX.read(data, {
                                      type : 'binary'
                                  });

                                  var result = {};

                                  workbook.SheetNames.forEach(function(sheetName) {
                                      var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                      if (roa.length > 0) {
                                          result[sheetName] = roa;
                                      }

                                  });


                                  //displaying the json result
                                  var resultEle=document.getElementById("json-result");
                                  var a=JSON.stringify(result, null, 4);
                                  resultEle.value=a;
                                  console.log(resultEle.value);
                                  }
                              }catch(e){
                                  console.error(e);
                                  console.log("catch :(")
                             }};

async function subirABBDD(texto){
var empleado = texto.substring(texto.indexOf('"fk_empleado": ') + 15, texto.indexOf(","));
            console.log("fk_empleado:"+empleado);
            var fecha = texto.substring(texto.indexOf('"a_fecha": ') + 11, nthIndex(texto, ',', 2));
                        console.log("fecha:"+fecha);
            var horae = texto.substring(texto.indexOf('"a_hora_entrada": ') + 18, nthIndex(texto, ',', 3));
                        console.log("h entrada:"+horae);
            var horas = texto.substring(texto.indexOf('"a_hora_salida": ') + 17, texto.indexOf("}"));
                                    console.log("h entrada:"+horas);

             const response = await fetch(`/api/excelemp`,{method: 'POST',
                    body: superjson.stringify({fk_empleado: empleado,
                                                a_fecha: fecha,
                                                a_hora_salida: horas,
                                                a_hora_entrada: horae
                                                        })
                                                      });
                     const data = await response.json();
                     console.log(data);
                     console.log(`${data}`);
};

//esto se encarga de subir los datos jejeje
      async function handleSubmit(e){

            const archivo=cambioFile();
            excelFileToJSON(archivo);
            var texto=document.getElementById("json-result").value; //this is what we call "cheesing it"
            //texto es string                                       //o como decimos la gente cool: queseandolo


            console.log("excel:", archivo); //esto es lit el archivo.xmlx
            console.log("jsontexto", texto); //esto es el string con el json

            //SI ES MAS DE UNO, PROCESA SOLO EL PRIMERO :)
            if(counter>0){
            //i am so mad this works
            //esto extrae los datos del string json :)

            if (texto.includes("},")){
            console.log("entra a if");
                while (texto.includes("},")){
                subirABBDD(texto);
                texto=texto.substring(texto.indexOf("},")+2);
                console.log("texto acortado:",texto);
                }
            }


            console.log("entra a else");
            subirABBDD(texto);
            }

            counter++;
            document.getElementById("descripcion").textContent="Documento cargado. Por favor confirme.";
            document.getElementById("boton").textContent="Confirmar";

        e.preventDefault();



     /*Axios.post("http://localhost:5488/api/report",
            {'template':
                {'name':'/Reportes Sweet UCAB/Lista de empleados por periodo de tiempo/empleados','recipe':'chrome-pdf'}  ,
                            'data':
                  {"fechainicio": formik.values.fechainicial,
                  "fechafin": formik.values.fechafinal //DIOS MIO SE LOGRÓ }
            }},
            {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                }
            })
                .then((res) => {
                                const contentType = res.headers["content-type"];
                                const blob = new Blob([res.data], {contentType} );
                                const url = window.URL.createObjectURL(new Blob([blob]));
                                const link = document.createElement('a');
                                link.href = url;

                                link.setAttribute('download', 'reporte-empleados.pdf'); //or any other extension
                                document.body.appendChild(link);
                                console.log("link: " +link);
                                link.click();
                                link.parentNode.removeChild(link);
                            }).catch((error) => console.log("se dio este error:"+error));
            console.log("Pasó YAY");
        //Router.back();*/
      }


    return (
        <Layout>
        <h3>CARGA DE ASISTENCIAS EMPLEADOS - EXCEL</h3>
        <h4 id="descripcion">Por favor, introduzca únicamente archivos .xlsx que sigan el formato correspondiente.</h4>
          <form  onSubmit={handleSubmit} >
              <ul>
              <li><input type="file" id="inputFileServer" accept=".xlsx"/>
</li>
<li>
<textarea id="json-result" display="block"
                               margin-left="auto"
                               margin-right="auto"></textarea>
</li>

                  <li className="Button">
                      <Button id="boton" type={"submit"} variant="contained" color={"success"} disabled={!(formik.isValid)}>Enviar</Button>
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

            Button {
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

        </Layout>
      )
};

export default Component;