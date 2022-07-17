import React, { ReactNode, useState } from "react";
import styles from './crud.module.css';
import Image from 'next/image';
import prisma from "../lib/prisma";
import useSWR from 'swr';
import handlerPrisma from "../pages/api/[...nextcrud]";
import Router from "next/router";

type CrudProps<ArbType extends Object> = {
    copiedObj: ArbType; 
    mainObj: ArbType;
    objType: any;
    id: any;
}


const CrudElement: React.FC<CrudProps<any>> = (props)=>{
    // const [id, setId] = useState(props.copiedObj.id);
    // async function handleDelete(e) {
    //     const deletedObj = await prisma[props.objType].delete(
    //         {where:{
    //             [props.mainObj.id]: id,
    //         }
    //     }
    //     )
    // }

    async function handleDelete(e){
      console.log(props.id);
      const response = await fetch(`/api/lugar/${props.id}`,{method: "DELETE"});
      console.log(JSON.stringify(response));
    }

    function handleUpdate(e){
        console.log(props.id);
        // Router.push("/updatelugar/[id]", `/updatelugar/${props.id}`);
        Router.push("/updatelugar")
    }

    

    // const fetcher = (url: string) => fetch(url, {
    //     method: 'GET',

    // }).then((res) =>res.json());

    // const {data, error} = useSWR('/api/user', fetcher);
    

    return(<tr >
        {Object.keys(props.copiedObj).map((key)=>{
            return (
            (key.includes("id")) ? <td onClick={() => Router.push("/lugar/[id]", `/lugar/${props.mainObj[key]}`)}>{props.mainObj[key]}</td>
            :
            <td>{props.mainObj[key]}</td>);
        })}
        <td className={styles.crudIcon}><Image src="/images/iconoDelete.png" width={30} height={30} onClick={handleDelete}/></td>
        <td className={styles.crudIcon}><Image src="/images/iconoUpdate.png" width={30} height={30} onClick={handleUpdate}/></td>
    </tr>);
};

export default CrudElement;