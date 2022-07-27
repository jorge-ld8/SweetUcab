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

        let nroCliente = cuenta._count.cliente_juridico + cuenta._count.cliente_natural + 1;
        let codRegistro = String(tienda.t_id).padStart(2, "0")+"-"+String(nroCliente).padStart(8,"0");

        cliente_juridico = await prisma.cliente_juridico.create({
            data: {
                c_rif: JSON.parse(req.body)['rif'],
                c_cantidad_puntos: 0,
                c_codigo_registro: codRegistro,
                c_razon_social: JSON.parse(req.body)['razon_social'],
                c_denom_comercial: JSON.parse(req.body)['denom_comercial'],
                c_capital_disponible: JSON.parse(req.body)['capital_disponible'],
                c_direccion: JSON.parse(req.body)['direccion'],
                c_direccion_fiscal_ppal: JSON.parse(req.body)['direccion_fiscal_ppal'],
                c_pagina_web: JSON.parse(req.body)['pagina_web'],
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