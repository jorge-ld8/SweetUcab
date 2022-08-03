import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let cliente_juridico = null, response = null;
    
    if(req.method === "POST"){
        // buscar estatus con nombre actual
        const estatus = await prisma.estatus.findFirst({
            where:{
                e_nombre: JSON.parse(req.body)['estatus'],
            }
        });

        // actualizar fecha final del ultimo estado
        const ultimoEstatus = await prisma.estatus_transaccion.updateMany({
            where:{
                e_fecha_fin: null
            },
            data:{
                e_fecha_fin: new Date(),
            }
        })

        const estatus_transaccion = await prisma.estatus_transaccion.create({
            data:{
                e_fecha_hora_establecida: new Date(),
                fk_estatus: estatus.e_id,
                fk_transaccion_compra: Number(JSON.parse(req.body)['transaccion']),
            }
        });
        res.json(estatus_transaccion);
    }
    if(req.method === "GET"){
        response = await prisma.rol.findMany();
        res.json(response);
    }
};