import React, { ReactNode } from "react";
import Header from "./Header";


type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <div className="layout">{props.children}</div>
    <style jsx global>{`
      html {
        box-sizing: border-box;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        padding: 0;
        font-size: 16px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol";
        background: rgba(0, 0, 0, 0);
        position: relative;
      }

      input,
      textarea {
        font-size: 16px;
      }

      button {
        cursor: pointer;
      }

      code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
        }

        /* Header styling */
        header{
          display: flex;
          justify-content: space-between;
          align-items: center;
          t
      }
      
      header ul,
      nav ul{
          list-style: none;
          margin: 0;
          padding: 0;
      }

      header{
          background-color: #FEE2E6;
          position: sticky;
      }

      .header{
        position: sticky;
      }
        
        .imagenLogo{
            max-width: 100%;
            height: 130px;
        }
        
        .icons{
            display: flex;
            justify-content: flex-end;
        }
        
        .icons *{
            margin: 0 .6em 0 .2em;
        }
        
        /* Nav Bar styling */
        nav ul{
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin: auto 0;
            padding: 0;
            height: 50px;
        }
        
        nav{
            background-color: #E02464;
        }
        
        nav a {
            text-decoration: none;
            display: block;
            padding: 0.5em 1em;
            color: white;
            text-transform: uppercase;
            font-size: 1.2em;
        }
        nav li{
          flex: 1;
          text-align: center;
        }
        
        /* Main styling */
        main{
          text-align: center;
          position: relative;
          margin-top: 1em;
          min-height: 100vh;
        }
        
        /* Footer styling */
        footer{
            text-align: center;
        }

        /*Table Styling*/ 
        main table{
           table-layout: fixed;
           border-collapse: collapse;
           width: 90%;
           align-self: center;
           margin: 6em auto;
        }

        td:nth-of-type(1){
          text-decoration: underline;
        }

        td:nth-of-type(1):hover{
          background-color: rgba(0, 0, 0, 0.2);
          border: 2px solid black;
          cursor: pointer;
        }

        td, th{
          border: 1.5px solid black;
          word-wrap: break-word;
        }

        th{
          background-color: lightgray;
        }

        tbody td{
           text-align: center;
           padding: .9em 0;
        }

        thead th{
          font-size: 1.2rem;
        }

        table{
          letter-spacing: 1px;
        }

        /*Form Styling*/
        form{
          margin: 4em auto;
          padding: 1em;
        }
        form ul{
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: center;
        }

        form li + li{
          margin-top: 1.5em;
        }

        label{
          display: inline-block;
          width: 100px;
          text-align: right;
          margin-right: .5em;
        }

        input,
        textarea {
          /* To make sure that all text fields have the same font settings
            By default, textareas have a monospace font */
          font: 1em sans-serif;

          /* Uniform text field size */
          width: 300px;
          box-sizing: border-box;

          /* Match form field borders */
          border: 1px solid #999;
        }
    `}</style>
    <style jsx>{`
      .layout {
        padding: 0 0rem;
      }
    `}</style>
  </div>
);

export default Layout;
