import React from "react";
import Link from "next/link";

type NavBarProps = {
    links: NavElement[];
}

export type NavElement = {
    link: string,
    title: string
}

const NavBar: React.FC<NavBarProps> = ({links}) => {
    return(
        <nav>
            <ul> 
                {links.map(({link, title})=>{
                    return                     (<li key={link}>
                        <a href={link}>{title}</a>
                </li>);
                })}
            </ul>
            <style jsx>{`
                nav a:hover{
                    background-color: #C00444;
                }
            `}
            </style>
        </nav> 
    );
}

export default NavBar;