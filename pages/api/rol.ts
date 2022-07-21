import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let response = null;
    if(req.method === "POST"){
            response = await prisma.rol.create({
                data: {
                    r_descripcion: JSON.parse(req.body)['descripcion'],
                    r_tipo: JSON.parse(req.body)['tipo'], 
                }
        })
        res.json(response);
    }
    if(req.method === "GET"){
        response = await prisma.rol.findMany();
        res.json(response);
    }
};