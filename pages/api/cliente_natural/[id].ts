import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../lib/prisma';
import superjson from "superjson";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {id} = req.query;
    if(req.method === "GET"){
        const response = await prisma.cliente_natural.findUnique({     
            where:{
                    c_id: Number(id)
                }
         }
        );
        res.json(response);
    }
    else if(req.method === "DELETE"){
        const response = await prisma.cliente_natural.delete({
            where:{
                c_id: Number(id)
            }
        });
        res.json(response);
    }
    else if(req.method === "POST"){
        let tienda = await prisma.tienda.findFirst({
            where:{
                t_nombre: JSON.parse(req.body)['tienda'],
            }
        });

        let cliente_natural = await prisma.cliente_natural.update({
            data: {
                c_rif: JSON.parse(req.body)['rif'],
                c_cantidad_puntos: Number(JSON.parse(req.body)['cantidad_puntos']),
                c_nombre1: JSON.parse(req.body)['nombre1'],
                c_nombre2:  JSON.parse(req.body)['nombre2'],
                c_apellido1:  JSON.parse(req.body)['apellido1'],
                c_apellido2: JSON.parse(req.body)['apellido2'],
                c_cedula: JSON.parse(req.body)['cedula'],
                c_direccion: JSON.parse(req.body)['direccion'],
                fk_tienda: tienda.t_id
            },
            where:{
                c_id: Number(id)
            }
        });
        res.json(cliente_natural);
    }
}