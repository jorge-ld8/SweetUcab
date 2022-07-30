import React  from 'react';
// nodejs library that concatenates classes
import classNames from "classnames";
import DateFnsUtils from '@date-io/date-fns';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
//import { downloadFile } from 'react-file-downloader'
// @material-ui/icons

// core components
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import Header from "components/Header/Header.js";
import MenuItem from '@material-ui/core/MenuItem';
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import HeaderLinks from "components/Header/HeaderLinks.js";

import CustomInput from "components/CustomInput/CustomInput.js";
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import Axios from "axios";
import { defaultBoxShadow } from 'assets/jss/material-kit-react';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { number } from 'prop-types';


// Sections for this page

const dashboardRoutes = [];

const useStyles = makeStyles(styles);



export default function LandingPage(props) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [naturalid, setNaturalID] = React.useState('0');
  const [juridicoid, setJuridicoID]= React.useState('0');
  //const [salidamin, setsalidamin] = React.useState(new Date("2020-12-20"));
  //const [salidamax, setsalidamax] = React.useState(new Date("2020-12-20"));
  //const [html, setHTML]= React.useState('');


  const handlenombre = (event) => {
    setAgencia(event.target.value);
    
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { ...rest } = props;
  const handleClick = (naturalid,juridicoid) =>{
    if(naturalid=='') {naturalid=0; console.log(naturalid)};
    if(juridicoid=='') {juridicoid=0; console.log(juridicoid)};
    if(!isNaN(juridicoid)&&!isNaN(naturalid)){

        //TODO: AQUI COLOCA LOS VALORES DE LA VAINA
    Axios.post("http://localhost:5488/api/report",
    {'template':{'name':'factura','recipe':'chrome-pdf'}  ,
  'data':
  //recordar que este id es en realidad id de transaccion
  {"naturalid": naturalid,
  "juridicoid": juridicoid
    }},
    {
        responseType: 'arraybuffer',
        headers: {
            'Content-Type': 'application/json',
            
            'Accept': 'application/pdf'
        }
    })
    .then((res) => {
        const contentType = res.headers["content-type"];
        const blob = new Blob([res.data], {contentType} ); 
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'factura.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    })
    .catch((error) => console.log(error));

  }else handleClickOpen()
}
//ESTE MUESTRA LA FACTURA EN PAGINA
 /* const handleClick1 = (agencia,costomin,costomax,personas,salidamin,salidamax,duracion) =>{

    if(costomin=='') {costomin=0; console.log(costomin)};
    if(costomax=='') {costomax=0; console.log(costomax)};
    if(personas=='') {personas=0; console.log(personas)};
    if(duracion=='') {duracion=0; console.log(duracion)};
    if(!isNaN(costomin)&&!isNaN(costomax)&&!isNaN(personas)&&!isNaN(duracion)){
    Axios.post("http://localhost:5488/api/report",
    {'template':{'name':'fichaa'}  ,
  'data':
  {"continente": agencia,
  "costomin": costomin,
  "costomax": costomax,
  "personas": personas,
  "salidamin": salidamin,
  "salidamax": salidamax,
  "duracion": duracion
    }},
    {
        responseType: 'text',
        headers: {
            'Content-Type': 'application/json',
            'Accept':'HTML'
            
            
        }
    })
    .then((res) => {
      const contentType = res.headers["content-type"];
      console.log(res.status);
      htmlnuevo(res); 
    })
    .catch((error) => console.log(error));
  }else handleClickOpen()
  }
*/
    //renderiza
  return (
    <div>
      <Header
        color="transparent"
        routes={dashboardRoutes}
        brand="star subastas"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
     
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
        <GridContainer>
            <GridItem> </GridItem>
        </GridContainer><GridContainer>
            <GridItem>&nbsp; </GridItem>
        </GridContainer>
        <GridContainer>
            <GridItem> &nbsp; </GridItem><GridItem> &nbsp; </GridItem><GridItem> &nbsp; </GridItem><GridItem> &nbsp; </GridItem>
        </GridContainer>
        <GridContainer>
            <GridItem> &nbsp;</GridItem>
        </GridContainer><GridContainer>
            <GridItem> </GridItem>
        </GridContainer>
        <GridContainer>
            <GridItem> </GridItem>
        </GridContainer>
        <GridContainer>
            <GridItem> <label><h1>Factura</h1> </label></GridItem>
        </GridContainer>

        <GridContainer>
            <GridItem> <h1></h1> </GridItem>
        </GridContainer><GridContainer>
            <GridItem> 
              <h1></h1>

            </GridItem>
        </GridContainer>
        <GridContainer>
            <GridItem>  <h1></h1><h1></h1> </GridItem>
        </GridContainer>


        <List className={classes.list}>

        <ListItem>
            <CustomInput
                      labelText="ID (juridico)"
                      id="juridicoid"
                      
                      inputProps={{onChange: e => setJuridicoID(e.target.value)
                      }
                    }
                    /> 
                    
            <CustomInput
                      labelText="ID (Natural)"
                      id="naturalid"
                      
                      inputProps={{
                        
                        onChange: e => setNaturalID(e.target.value)
                      }}
                    />    
            </ListItem>
                    </List>
                    
                   
                     

 
                    <GridContainer>      
                
                <div dangerouslySetInnerHTML={{__html:html}}></div>
                
                </GridContainer>   
         
          <GridContainer>
            <GridItem>
              <Button onClick={(e) =>handleClick(juridicoid,naturalid)} >Factura </Button>
            </GridItem>
         
          </GridContainer>
          <div>
             
          </div>
          <div>&nbsp;</div>
          <div>
          <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Todos los datos deben ser numeros o vacios, por favor verifica
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}