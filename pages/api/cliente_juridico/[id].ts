import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../lib/prisma';
import superjson from "superjson";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {id} = req.query;
    if(req.method === "GET"){
        const response = await prisma.cliente_juridico.findUnique({     
            where:{
                    c_id: Number(id)
                }
         }
        );
        res.json(response);
    }
    else if(req.method === "DELETE"){
        const response = await prisma.cliente_juridico.delete({
            where:{
                c_id: Number(id)
            }
        });
        res.json(response);
    }
    else if(req.method === "POST"){
        let tienda = await prisma.tienda.findFirst({
            where:{
                t_id: JSON.parse(req.body)['tienda'],
            }
        });

        //hallar codigo de registro
        let cuenta = await prisma.tienda.findUnique({
            where:{
                t_id: tienda.t_id
            },
            select:{
                _count: {
                    select: {
                        cliente_juridico: true,
                        cliente_natural: true,
                    },
                },
            },
        })
        
        let cliente_juridico = await prisma.cliente_juridico.update({
            data: {
                c_rif: JSON.parse(req.body)['rif'],
                c_cantidad_puntos: Number(JSON.parse(req.body)['cantidad_puntos']),
                c_razon_social: JSON.parse(req.body)['razon_social'],
                c_denom_comercial: JSON.parse(req.body)['denom_comercial'],
                c_capital_disponible: Number(JSON.parse(req.body)['capital_disponible']),
                c_direccion: JSON.parse(req.body)['direccion'],
                c_direccion_fiscal_ppal: JSON.parse(req.body)['direccion_fiscal_ppal'],
                c_pagina_web: JSON.parse(req.body)['pagina_web'],
                fk_tienda: tienda.t_id
            },
            where:{
                c_id: Number(id)
            }
        });
        res.json(cliente_juridico);
    }
}