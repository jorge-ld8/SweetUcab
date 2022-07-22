import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';
import superjson from "superjson";
import UserProfile from "../userSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let oferta = null, response = null;
    
    if(req.method === "POST"){
        let {p_id} = await prisma.producto.findFirst({
            where: {
                p_nombre: superjson.parse(req.body)['fk_producto']
            },
            select: {
                p_id: true
            }
        })

        oferta = await prisma.oferta.create({
            data: {
                o_descripcion: superjson.parse(req.body)['o_descripcion'],
                o_porcentaje_descuento: Number(superjson.parse(req.body)['p_descuento']),
                o_fecha_inicio: new Date(superjson.parse(req.body)['fecha_inicio']),
                o_fecha_fin: new Date(superjson.parse(req.body)['fecha_fin']),
                fk_producto: p_id
            },
        });
    res.json(oferta);
    }

    else if(req.method === "GET"){
        response = await prisma.oferta.findMany();
        res.json(response);
    }
};