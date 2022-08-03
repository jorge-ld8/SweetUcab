import { lugar } from "@prisma/client";
import React, { ReactNode } from "react";
import reactMarkdown from "react-markdown";

export type DropDownListProps<ArbType extends Object> = {
    content: ArbType[]
    attValueName: string
    objType: string
    name: string
    onChange: any
    value: any
    multiple?: boolean
    message?: string  //en DropDownList no se usa pero en  DataList si :)
}

const DropDownList: React.FC<DropDownListProps<any>> = (props)=>
{
    return(
        <select name={props.name} onChange={props.onChange} value={props.value} id={props.name} multiple={props.multiple}>
            <option value="">N/A</option>
            {props.content.map((option)=>{               
                return (<option value={option[props.attValueName]}>{option[props.attValueName]}</option>);
            })}
        </select>
    );
};

export default DropDownList