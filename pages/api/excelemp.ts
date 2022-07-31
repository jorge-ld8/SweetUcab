import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let response = null;

    if(req.method === "POST"){
    let empleado = await prisma.empleado.findFirst({
                where:{
                    e_id: String(JSON.parse(req.body)['fk_empleado']),
                }
            });

        let asistencia_empleado = await prisma.asistencia_empleado.create({
            data: {
                fk_empleado: empleado.e_id,
                a_fecha: JSON.parse(req.body)['a_fecha'],
                a_hora_entrada: JSON.parse(req.body)['a_hora_entrada'],
                a_hora_salida: JSON.parse(req.body)['a_hora_salida']
            }
        });
        res.json(asistencia_empleado);
    }
    if(req.method === "GET"){
        response = await prisma.rol.findMany();
        res.json(response);
    }
};