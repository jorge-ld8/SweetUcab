import { lugar } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    // const response = await prisma.lugar.findMany ({
    //     where: {
    //         l_id: 1;
    //     }
    // }) 
    let response = null;
    if(req.method === "DELETE"){
        response = await prisma.lugar.delete({
            where: {
                l_id: 50
            }
        })
    }
    if(req.method === "GET"){
        response = await prisma.lugar.findMany();
    }
    res.json(response);
};