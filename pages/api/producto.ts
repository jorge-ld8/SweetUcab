import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';
import fs from 'fs';
import superjson from "superjson";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let producto = null, response = null;
    
    if(req.method === "POST"){
        producto = await prisma.producto.create({
            data: {
                p_descripcion: JSON.parse(req.body)['descripcion'],
                p_nombre: JSON.parse(req.body)['nombre'],
                p_peso: Number(JSON.parse(req.body)['peso']),
                p_precio_actual: Number(JSON.parse(req.body)['precio_actual'])
            },
            select: {
                p_id: true,
                p_descripcion: true
            }
        });


         response =  await prisma.imagen_producto.create({
             data:{
                i_descripcion: producto['p_descripcion'],
                i_imagen: JSON.parse(req.body)['image'] ? JSON.parse(req.body)['image'] : null,
                fk_producto: producto['p_id'],
            }
         });

        // producto = await fetch('/api/imagen_producto', {method: 'POST'})
        //             .then(response => response.json())
        //             .catch(e=>console.error(e));
    }
    res.json(producto);
        //   const file = fs.readFileSync(JSON.parse(req.body)['image']);
            // producto = await prisma.producto.create({
            //     data: {
            //         p_descripcion: JSON.parse(req.body)['descripcion'],
            //         p_nombre: JSON.parse(req.body)['nombre'],
            //         p_peso: Number(JSON.parse(req.body['peso'])),
            //         p_precio_actual: Number(JSON.parse(req.body['precio_actual'])) 
            //     },
            //     // select:{
            //     //     p_id: true,
            //     //     p_descripcion: true
            //     // }
            // });
    //     res.json(producto);
    // }
    if(req.method === "GET"){
        response = await prisma.rol.findMany();
        res.json(response);
    }
};