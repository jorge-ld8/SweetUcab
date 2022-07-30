import React, {useState, useEffect} from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import Crud from "../components/Crud";
import { producto } from "@prisma/client";
import { FormControl, InputLabel, NativeSelect } from "@mui/material";

export const getStaticProps: GetStaticProps = async () => {
    const feed = await prisma.producto.findMany(
        {orderBy:{
        p_id: 'asc',
        },
        select:{
            p_id: true,
            p_nombre: true,
            p_descripcion: true,
            p_peso: true,
            p_precio_actual: true,
        }
        }
    );
    return { 
      props: { feed }, 
      revalidate: 10 
    } 
}

type Props<ArbType extends Object> = {
  feed: ArbType[]
}

const Blog: React.FC<Props<producto>> = (props) => {
  const[state, setState] = useState("active"); //state hook
  
  const metodosPago: string[] = ["cheque", "efectivo", "pagomovil", "paypal", "punto", "tarjeta", "zelle"];

  useEffect(() => {
   //componente mounts
   return () => {
   }
 }, [state]) //effect hook

  function handleStateChange(newState){
    setState(newState);
  }

  return (
        <FormControl>
            <InputLabel variant="standard" htmlFor="metodo_pago_1">
                Metodo de Pago 1
            </InputLabel>
            <NativeSelect
             defaultValue={""}
             inputProps={{
                name: "metodo_pago_1",
                id: "metodo_pago_1"
             }}
            >
            {metodosPago.map((value)=>{
                return (<option value={value}>{value.toLowerCase()}</option>)
            })}
            </NativeSelect>
        </FormControl>
  )
}

export default Blog