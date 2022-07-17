
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let response = null, relPresente = JSON.parse(req.body)['relacion'];
    let objeto = null;
    if(req.method === "POST"){
            if(relPresente){
                objeto = await prisma.lugar.findFirst({
                    where: {
                        l_descripcion:  String(JSON.parse(req.body)['relacion']),
                    },
                    select: {
                        l_id: true
                    }
                })
            }
            response = await prisma.lugar.create({
                data: {
                    l_descripcion: String(JSON.parse(req.body)['descripcion']),
                    l_tipo: String(JSON.parse(req.body)['tipo']), 
                    fk_lugar: relPresente ?  Number(objeto.l_id) : null 
                }
        })
        res.json(response);
    }
    if(req.method === "GET"){
        response = await prisma.lugar.findMany();
        res.json(response);
    }
};