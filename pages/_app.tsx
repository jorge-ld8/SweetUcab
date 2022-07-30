import { AppProps } from "next/app";
import React, { useEffect, useState } from 'react'; 
import { ReactSession} from 'react-client-session';
import Footer from "../components/Footer";
import Header from "../components/Header";
import Layout from "../components/Layout";
import NavBar from "../components/NavBar";

const App = ({ Component, pageProps }: AppProps) => {
  const [appState, setappState] = useState([]);

  function handleStateChange(appState){
    setappState(appState);
  }
  
  return (
    <>
      <Layout>
        <Header/>
        <NavBar roles={appState ?? []} handleStateChange={handleStateChange}/>
        <Component {...pageProps}/>
        <Footer/>
      </Layout>
    </>
  );
};
export default App;
