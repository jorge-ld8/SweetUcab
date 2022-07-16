import React, { ReactNode, useState } from "react";
import styles from './crud.module.css';
import Image from 'next/image';
import prisma from "../lib/prisma";

type CrudProps<ArbType extends Object> = {
    copiedObj: ArbType; 
    mainObj: ArbType;
    objType: any;
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

    return(<tr >
        {Object.keys(props.copiedObj).map((key)=>{
            return (<td>{props.mainObj[key]}</td>);
        })}
        <td className={styles.crudIcon}><Image src="/images/iconoDelete.png" width={30} height={30} onClick={()=>console.log("fuckit edit")}/></td>
        <td className={styles.crudIcon}><Image src="/images/iconoUpdate.png" width={30} height={30} onClick={()=>console.log("fuckit edit")}/></td>
    </tr>);
};

export default CrudElement;