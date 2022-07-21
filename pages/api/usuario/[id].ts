import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {id} = req.query;
    if(req.method === "GET"){
        const response = await prisma.usuario.findUnique({     
            where:{
                    u_id: Number(id)
                }
         }
        );
        res.json(response);
    }
    else if(req.method === "DELETE"){
        const response = await prisma.usuario.delete({
            where:{
                u_id: Number(id)
            }
        });
        res.json(response);
    }
    else if(req.method === "POST"){
        const response = await prisma.usuario.update({
            where:{
                u_id: Number(id)
            },
            data: {
                u_username: String(JSON.parse(req.body)['username']),
                u_email: String(JSON.parse(req.body)['email']),
                u_password: String(JSON.parse(req.body)['password'])
            }
        })
        res.json(response);
    }

};