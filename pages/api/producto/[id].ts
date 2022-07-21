import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {id} = req.query;
    if(req.method === "GET"){
        const response = await prisma.producto.findUnique({     
            where:{
                    p_id: Number(id)
                }
         }
        );
        res.json(response);
    }
    else if(req.method === "DELETE"){
        const response = await prisma.producto .delete({
            where:{
                p_id: Number(id)
            }
        });
        res.json(response);
    }
    else if(req.method === "POST"){
        const response = await prisma.producto.update({
            where:{
                p_id: Number(id)
            },
            data: {
                p_descripcion: JSON.parse(req.body)['descripcion'],
                p_nombre: JSON.parse(req.body)['nombre'],
                p_peso: Number(JSON.parse(req.body)['peso']),
                p_precio_actual: Number(JSON.parse(req.body)['precio_actual'])
            }
        })
        res.json(response);
    }
}