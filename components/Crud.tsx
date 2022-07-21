import React, { ReactNode, useEffect, useState } from "react";
import reactMarkdown from "react-markdown";
import CrudElement from "./CrudElement";
import { PostProps } from "./Post";
import styles from './crud.module.css';
import Image from "next/image";
import Link from "next/link";
import Router, { useRouter } from "next/router";


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
        <button className={styles.addButton} onClick={()=>{Router.push(`create${props.name}`)}}><Image src={"/images/iconoAdd.png"} width={90} height={90}></Image></button>
        <table>
            <thead>
                <tr>
                    {props.headers.map((h)=>(<th>{h}</th>))}
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {props.content.map((element)=>{
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