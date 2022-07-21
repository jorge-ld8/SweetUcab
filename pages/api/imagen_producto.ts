import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';
import fs from 'fs';
import superjson from "superjson";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let producto = null, imagen = null, response = null;
    
    if(req.method === "POST"){
        imagen = await prisma.imagen_producto.create({
              data:{
                  i_descripcion:"Hola",
                  fk_producto: 1,
             }
        });
        res.json(imagen);
    }
    if(req.method === "GET"){
        response = await prisma.rol.findMany();
        res.json(response);
    }
};