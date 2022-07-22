import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../lib/prisma';
import superjson from "superjson";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {id} = req.query;
    if(req.method === "GET"){
        const response = await prisma.oferta.findUnique({     
            where:{
                    o_id: Number(id)
                }
         }
        );
        res.json(response);
    }
    else if(req.method === "DELETE"){
        const response = await prisma.oferta.delete({
            where:{
                o_id: Number(id)
            }
        });
        res.json(response);
    }
    else if(req.method === "POST"){
        const {p_id} = await prisma.producto.findFirst({
            where: {
                p_nombre: superjson.parse(req.body)['p_nombre'],
            },
            select: {
                p_id: true
            }
        })
        const response = await prisma.oferta.update({
            where:{
                o_id: Number(id)
            },
            data: {
                o_descripcion: superjson.parse(req.body)['o_descripcion'],
                o_porcentaje_descuento: Number(superjson.parse(req.body)['p_descuento']),
                o_fecha_inicio: new Date(superjson.parse(req.body)['fecha_inicio']),
                o_fecha_fin: new Date(superjson.parse(req.body)['fecha_fin']),
                fk_producto: Number(p_id)
            },
        })
        res.json(response);
    }
};