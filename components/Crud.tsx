import React, { ReactNode, useEffect, useState } from "react";
import CrudElement from "./CrudElement";
import styles from './crud.module.css';
import Router, { useRouter } from "next/router";
import {AddCircle} from "@mui/icons-material";
import { IconButton } from "@mui/material";


interface Props<ArbType extends Object>{
    headers: String[],
    content: ArbType[],
    name: string, 
    stateChanger: Function,
}


const Crud: React.FC<Props<any>> = (props)=>{
    const [state, setState] = useState("active");
    useEffect(() => {
        console.log(`Crud state: ${state}`);
        return ()=>{ 
            props.stateChanger(props.content);
        };}
    , [state]);

    function handleStateChange(newState){
        setState(newState);
    }

    return (
    <div >
        <h2>{props.name.toUpperCase()}</h2>
        <div className={styles.addButton}>
            <IconButton onClick={()=>{Router.push(`create${props.name}`)}} sx={{color: 'green'}} size="large"><AddCircle/></IconButton>
        </div>
        <table>
            <thead>
                <tr>
                    {props.headers.map((h)=>(<th>{h}</th>))}
                    <th className={styles.crudIcon}></th>
                    <th className={styles.crudIcon}></th>
                </tr>
            </thead>
            <tbody>
            {props.content?.map((element)=>{
                let copiedEl = JSON.parse(JSON.stringify(element));
                const elId = Object.keys(copiedEl).find((el)=>(el.includes("id")));
                return(
                    <CrudElement copiedObj={copiedEl} mainObj={element} objType={props.name} key={element[elId]} id={element[elId]} stateChanger={handleStateChange}/>
                )
            })}
            </tbody>
        </table>
        <style jsx>{`
            thead th:nth-last-child(1),
            thead th:nth-last-child(2){
                width: 10%;
                border: 0;
                background-color: white;
            }
            `}
        </style>
    </div>);
};

export default Crud;