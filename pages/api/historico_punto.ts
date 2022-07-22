import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';
import superjson from "superjson";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let response = null;
    if(req.method === "POST"){
        //devolver el punto con el id maximo q esta en la bd
        let actuPunto = await prisma.historico_punto.aggregate(
            {
                _max:{
                    h_id: true,
                }
            }); 

        response = await prisma.historico_punto.create({
                data: {
                    h_valor: Number(superjson.parse(req.body)['h_valor']), 
                    h_fecha_emision: new Date(),
                }
        });

        //actualizar el punto anterior y colocar como fecha final, la actual
        await prisma.historico_punto.update({
            where: {
                h_id: actuPunto._max.h_id,
            }, 
            data:{
                h_fecha_final: new Date()
            }
        })

        res.json(response);
    }
    else if(req.method === "GET"){
        response = await prisma.historico_punto.findMany();
        res.json(response);
    }
};