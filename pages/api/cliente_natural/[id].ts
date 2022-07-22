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

        let cliente_juridico = await prisma.cliente_juridico.create({
            data: {
                c_rif: superjson.parse(req.body)['rif'],
                c_cantidad_puntos: 1,
                c_codigo_registro: superjson.parse(req.body)['codigo_registro'],
                c_razon_social: superjson.parse(req.body)['razon_social'],
                c_denom_comercial: superjson.parse(req.body)['denom_comercial'],
                c_capital_disponible: Number(superjson.parse(req.body)['capital_disponible']),
                c_direccion: superjson.parse(req.body)['direccion'],
                c_direccion_fiscal_ppal: superjson.parse(req.body)['direccion_fiscal_ppal'],
                c_pagina_web: superjson.parse(req.body)['pagina_web'],
                fk_tienda: tienda.t_id
            }
        });
        res.json(cliente_juridico);
    }
}