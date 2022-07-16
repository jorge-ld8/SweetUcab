import React, { ReactNode } from "react";
import reactMarkdown from "react-markdown";
import CrudElement from "./CrudElement";
import { PostProps } from "./Post";
import styles from './crud.module.css';
import Image from "next/image";
import Link from "next/link";
import { lugar } from "@prisma/client";


const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )

type CrudProps = {
    header: String[],
    content: lugar[]
}

interface Props<ArbType extends Object>{
    content: ArbType[]
}


const Crud: React.FC<Props<any>> = (props)=>{    
    let copiedHeaders = Object.keys(JSON.parse(JSON.stringify(props.content[0])));
    return (
    <div >
        <table>
            <thead>
                <tr>
                    {copiedHeaders.map((h)=>(<th>{h}</th>))}
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {props.content.map((element)=>{
                let copiedEl = JSON.parse(JSON.stringify(element));
                return(
                    <CrudElement copiedObj={copiedEl} mainObj={element} objType={'lugar'}/>
                )
            })}
            </tbody>
        </table>
        <style jsx>{`
            thead th:nth-child(5),
            thead th:nth-child(6){
                width: 10%;
                border: 0;
                background-color: white;
            }
            `}
        </style>
    </div>);
};

export default Crud;