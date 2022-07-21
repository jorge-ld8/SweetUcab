import React, { ReactNode, useEffect, useState } from "react";
import styles from './crud.module.css';
import Image from 'next/image';
import prisma from "../lib/prisma";
import Router from "next/router";

type CrudProps<ArbType extends Object> = {
    copiedObj: ArbType; 
    mainObj: ArbType;
    objType: string;
    id: any;
    stateChanger: Function;
}


const CrudElement: React.FC<CrudProps<any>> = (props)=>{
    const[state, setState] = useState("active"); //state hook

    useEffect(() => {
      //componente mounts
      return () => {
          console.log("CrudElement unmounted");
          props.stateChanger(state);
      }
    }, [state]) //effect hook
    
    async function handleDelete(e){
      console.log(props.id);
      const response = await fetch(`/api/${props.objType}/${props.id}`,{method: "DELETE"}).then( 
        response =>{
          if(response.ok)
            return response.json()
        }
      ).catch(e => console.error(e));
     Router.push("/");
    }

    function handleUpdate(e){
        console.log(props.id);
        Router.push(`/update${props.objType}/[id]`, `/update${props.objType}/${props.id}`);
    }

    return(<tr key={props.id}>
        {Object.keys(props.copiedObj).map((key, index)=>{
            return (
            (key.includes("id")) ? <td onClick={() => Router.push(`/${props.objType}/[id]`, `/${props.objType}/${props.mainObj[key]}`)} key={index}>{props.mainObj[key]}</td>
            :
            <td key={index}>{props.mainObj[key]}</td>);
        })}
        <td className={styles.crudIcon}><Image src="/images/iconoDelete.png" width={30} height={30} onClick={handleDelete} key={5}/></td>
        <td className={styles.crudIcon}><Image src="/images/iconoUpdate.png" width={30} height={30} onClick={handleUpdate} key={6}/></td>
    </tr>);
};

export default CrudElement;