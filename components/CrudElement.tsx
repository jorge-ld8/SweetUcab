import React, { ReactNode, useEffect, useState } from "react";
import styles from './crud.module.css';
import Image from 'next/image';
import prisma from "../lib/prisma";
import Router from "next/router";
import { IconButton } from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import AccessControl from "./AcesssControl";
import UserProfile from "../pages/userSession";

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
        <AccessControl userPermissions={UserProfile.getRol()} allowedPermissions={[`${props.objType}:delete`]} mode={"all"} >
          <td className={styles.crudIcon}><IconButton aria-label="delete" size="medium" onClick={handleDelete}><Delete sx={{color:'black'}}/></IconButton></td>
        </AccessControl> 
        <AccessControl userPermissions={UserProfile.getRol()} allowedPermissions={[`${props.objType}:update`]} mode={"all"}>
          <td className={styles.crudIcon}><IconButton aria-label="update" size="medium" onClick={handleUpdate}><Edit sx={{color:'black'}}/></IconButton></td>
        </AccessControl>
    </tr>);
};

export default CrudElement;