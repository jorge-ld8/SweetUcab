import { AppProps } from "next/app";
import React, { useEffect, useState } from 'react'; 
import { ReactSession} from 'react-client-session';
import Footer from "../components/Footer";
import Header from "../components/Header";
import Layout from "../components/Layout";
import NavBar from "../components/NavBar";

const App = ({ Component, pageProps }: AppProps) => {
  const [appPermisos, setappPermisos] = useState([]);
  const [username, setusername] = useState("")

  function handleStateChange(appState){
    setappPermisos(appState);
  }

  function handleUserChange(user){
    setusername(user);
  }
  
  return (
    <>
      <Layout>
        <Header user={username} handleUserChange={handleUserChange}/>
        <NavBar roles={appPermisos ?? []} handleStateChange={handleStateChange}/>
        <Component {...pageProps}/>
        <Footer/>
      </Layout>
    </>
  );
};
export default App;
