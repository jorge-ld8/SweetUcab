import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const{id} = req.query;
    if(req.method === "GET"){
        const response = await prisma.lugar.findUnique({     
            where:{
                    l_id: Number(id)
                }
        }
        );
        res.json(response);
    }
    else if(req.method === "DELETE"){
        const response = await prisma.lugar.delete({
            where:{
                l_id: Number(id)
            }
        });
        res.json(response);
    }
    else if(req.method === "PUT"){
        const response = await prisma.lugar.update({
            include:{
                lugar: true,
            },

            where:{
                l_id: Number(id)
            },
            data: {
                l_descripcion: String(req.query.descripcion),
                l_tipo: String(req.query.tipo)
            }
        })
        res.json(response);
    }

};