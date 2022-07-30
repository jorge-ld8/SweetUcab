import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method === "POST"){
        const response = await prisma.usuario.findUnique({     
            where:{
                    u_username: JSON.parse(req.body)['username'],
            },
            select:{
                fk_cliente_juridico: true,
                fk_cliente_natural: true
            }
         }
        ); 
        let puntos = null;
        if(response.fk_cliente_juridico){
            puntos = (await prisma.cliente_juridico.findUnique({
                where: {
                    c_id:response.fk_cliente_juridico,
                },
                select:{
                    c_cantidad_puntos: true
                }
            }));
        }
        else if(response.fk_cliente_natural){
            puntos = (await prisma.cliente_natural.findUnique({
                where: {
                    c_id:response.fk_cliente_natural,
                },
                select:{
                    c_cantidad_puntos: true
                }
            }));
        }
        res.json(puntos);
    }
};