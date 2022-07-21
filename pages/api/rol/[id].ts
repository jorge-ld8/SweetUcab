import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {id} = req.query;
    if(req.method === "GET"){
        const response = await prisma.rol.findUnique({     
            where:{
                    r_id: Number(id)
                }
         }
        );
        res.json(response);
    }
    else if(req.method === "DELETE"){
        const response = await prisma.rol.delete({
            where:{
                r_id: Number(id)
            }
        });
        res.json(response);
    }
    else if(req.method === "POST"){
        const response = await prisma.rol.update({
            where:{
                r_id: Number(id)
            },
            data: {
                r_descripcion: String(JSON.parse(req.body)['descripcion']),
                r_tipo: String(JSON.parse(req.body)['tipo']),
            }
        })
        res.json(response);
    }
}