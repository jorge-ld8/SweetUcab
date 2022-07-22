import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let cliente_juridico = null, response = null;
    
    if(req.method === "POST"){
        let tienda = await prisma.tienda.findFirst({
            where:{
                t_nombre: String(JSON.parse(req.body)['tienda']),
            }
        });

        cliente_juridico = await prisma.cliente_juridico.create({
            data: {
                c_rif: String(JSON.parse(req.body)['rif']),
                c_cantidad_puntos: 1,
                c_codigo_registro: String(JSON.parse(req.body)['codigo_registro']),
                c_razon_social: String(JSON.parse(req.body)['razon_social']),
                c_denom_comercial: String(JSON.parse(req.body)['denom_comercial']),
                c_capital_disponible: Number(JSON.parse(req.body)['capital_disponible']),
                c_direccion: String(JSON.parse(req.body)['direccion']),
                c_direccion_fiscal_ppal: String(JSON.parse(req.body)['direccion_fiscal_ppal']),
                c_pagina_web: String(JSON.parse(req.body)['pagina_web']),
                fk_tienda: tienda.t_id
            },
        });
    res.json(cliente_juridico);
    }
    if(req.method === "GET"){
        response = await prisma.rol.findMany();
        res.json(response);
    }
};