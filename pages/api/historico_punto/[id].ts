import type { NextApiRequest, NextApiResponse } from "next";
import { responseSymbol } from "next/dist/server/web/spec-compliant/fetch-event";
import prisma from '../../../lib/prisma';
import superjson from 'superjson';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {id} = req.query;
    if(req.method === "GET"){
        const response = await prisma.historico_punto.findUnique({     
            where:{
                    h_id: Number(id)
                }
         }
        );
        res.json(response);
    }
    else if(req.method === "DELETE"){
        const response = await prisma.historico_punto.delete({
            where:{
                h_id: Number(id)
            }
        });

        const ultimoPunto = await prisma.historico_punto.aggregate({
            _max:{
                h_id: true
            }
        })

        const updateUltimoPunto = await prisma.historico_punto.update({
            where:{
                h_id: ultimoPunto._max.h_id
            },
            data:{
                h_fecha_final: null,
            }
        })
        res.json(updateUltimoPunto);
    }
    else if(req.method === "POST"){
        const response = await prisma.historico_punto.update({
            where:{
                h_id: Number(id)
            },
            data: {
                h_valor: Number(superjson.parse(req.body)['valor']),
                h_fecha_emision: new Date(superjson.parse(req.body)['fecha_inicio']),
                h_fecha_final: superjson.parse(req.body)['fecha_final'] ? new Date(superjson.parse(req.body)['fecha_final']) : null
            }
        })
        res.json(response);
    }
};