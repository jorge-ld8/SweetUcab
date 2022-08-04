import React, {useState, useEffect} from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import Crud from "../components/Crud";
import { producto } from "@prisma/client";

export const getStaticProps: GetStaticProps = async () => {
    const feed = await prisma.asistencia_empleado.findMany(
        {orderBy:{
        a_id: 'asc',
        },
        select:{
            a_id: true,
            a_fecha: true,
            a_asistencia: true,
            a_hora_entrada: true,
            a_hora_salida: true,
            fk_empleado: true,
        }
        }
    );
    const emps = await prisma.empleado.findMany(
            {orderBy:{
            e_id: 'asc',
            },
            select:{
                e_id: true,
                e_nombre1: true,
                e_apellido1: true,
            }
            }
        );

            let feedJSON = feed.map(({a_id, a_fecha, a_asistencia, a_hora_entrada, a_hora_salida, fk_empleado})=>{
                return {a_id, a_fecha: new Date(a_fecha.setUTCHours(5)).toDateString(), a_asistencia: a_asistencia.toString(), a_hora_entrada: new Date(a_hora_entrada.setHours(a_hora_entrada.getHours()+4)).toTimeString().split(' ')[0], a_hora_salida: new Date(a_hora_salida.setHours(a_hora_salida.getHours()+4)).toTimeString().split(' ')[0], fk_empleado}
            }
            );

    return {
      props: { feed: feedJSON, emps },
      revalidate: 10
    }
}

type Props<ArbType extends Object> = {
  feed: ArbType[],
  emps: ArbType[]
}

const Blog: React.FC<Props<producto>> = (props) => {
  const[state, setState] = useState("active"); //state hook

  useEffect(() => {
   //componente mounts
   return () => {
   }
 }, [state]) //effect hook

  function handleStateChange(newState){
    setState(newState);
  }

  return (
    <main>
      <Crud headers={["ID", "Fecha", "Asistencia", "Hora de entrada", "Hora de salida", "ID empleado"]}content={props.feed} name={'asistencias'} stateChanger={handleStateChange}/>
    </main>
  )
}

export default Blog