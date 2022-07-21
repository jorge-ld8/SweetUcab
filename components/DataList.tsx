import React, { ReactNode } from "react";
import reactMarkdown from "react-markdown";
import { DropDownListProps } from "./Dropdownlist";

//Para aceptar valores que se introduzcan y/o elijan. Mejor opcion que DropDownList para numeros y asi
const DataList: React.FC<DropDownListProps<any>> = (props)=>
{
    return(
    <div>
        <label htmlFor={props.name}>{props.message}</label>
        <input list={props.name} id={props.name} name={props.name} onChange={props.onChange}/>
        <datalist id={props.name}>
            <option value="N/A">N/A</option>
            {props.content?.map((option)=>{
                return (<option value={option[props.attValueName]}>{option[props.attValueName]}</option>);
            })}
        </datalist>
    </div>
    );
};

export default DataList;