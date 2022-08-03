import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Router from 'next/router';
import Image from 'next/image';
import styles from '../components/crud.module.css';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

type Props = {
    imageUrl: string
    id: number
    prodName: string
    prodPrecio: number
}

const ElementoCompra: React.FC<Props> = (props) => {
  return (
    <Paper
      sx={{
        p: 2,
        margin: '1em',
        maxWidth: 500,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid container item spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <Img alt="complex" src={props.imageUrl} onClick={()=>{Router.push(`/detalle_producto_mix/${props.id}`)}} />
          </ButtonBase>
        </Grid>
        <Grid item xs={6} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                <h3>{props.prodName}</h3>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {props.prodPrecio}$
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ElementoCompra;
