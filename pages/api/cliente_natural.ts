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

        let cliente_natural = await prisma.cliente_natural.create({
            data: {
                c_rif: JSON.parse(req.body)['rif'],
                c_cantidad_puntos: 0,
                c_codigo_registro: codRegistro,
                c_nombre1: JSON.parse(req.body)['nombre1'],
                c_nombre2:  JSON.parse(req.body)['nombre2'],
                c_apellido1:  JSON.parse(req.body)['apellido1'],
                c_apellido2: JSON.parse(req.body)['apellido2'],
                c_cedula: JSON.parse(req.body)['cedula'],
                c_direccion: JSON.parse(req.body)['direccion'],
                fk_tienda: tienda.t_id
            }
        });
        res.json(cliente_natural);
    }
    if(req.method === "GET"){
        response = await prisma.rol.findMany();
        res.json(response);
    }
};