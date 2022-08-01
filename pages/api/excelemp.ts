import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';
import fs from 'fs';
import set from 'date-fns/set';
import superjson from "superjson";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let response = null;

    if(req.method === "POST"){

        const fecha=new Date(superjson.parse(req.body)['a_fecha']);
        const horae=superjson.parse(req.body)['a_hora_entrada'];
        const horae_hora=horae.substr(1,2);
        const horae_min=horae.substr(4,2);
        const horae_seg=horae.substr(7,2);
        const horas=superjson.parse(req.body)['a_hora_salida'];
        const horas_hora=horas.substr(1,2);
                const horas_min=horas.substr(4,2);
                const horas_seg=horas.substr(7,2);

//aqui se crea el objeto en la bbdd
console.log("en el ts:"+req.body);
        let asistencia_empleado = await prisma.asistencia_empleado.createMany({
            data: {
                fk_empleado: Number(superjson.parse(req.body)['fk_empleado']),
                a_fecha: new Date(fecha), //fecha funciona
                a_hora_salida: set(new Date(), { hours: parseInt(horas_hora)-4, minutes: parseInt(horas_min) , seconds: parseInt(horas_seg)}),
                a_hora_entrada: set(new Date(), { hours: parseInt(horae_hora)-4, minutes: parseInt(horae_min) , seconds: parseInt(horae_seg)}),
                //empleado: {
               // connect: {e_id: Number(superjson.parse(req.body)['fk_empleado'])}
                //}
                //,//a_fecha: JSON.parse(req.body)['a_fecha'],
                //a_hora_entrada: JSON.parse(req.body)['a_hora_entrada'],
                //a_hora_salida: JSON.parse(req.body)['a_hora_salida']
            }
        });
        res.json(asistencia_empleado);
    }
    if(req.method === "GET"){
        response = await prisma.rol.findMany();
        res.json(response);
    }
};