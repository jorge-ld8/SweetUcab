import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let response = null;
    if(req.method === "POST"){
            response = await prisma.rol.create({
                data: {
                    r_descripcion: JSON.parse(req.body)['descripcion'],
                    r_tipo: JSON.parse(req.body)['tipo'], 
                }
        })

        for(let permiso of JSON.parse(req.body)['relacion']){ //iterar por los permisos asignados
            let {p_id} = await prisma.permiso.findFirst({
                where: {
                    p_tipo: permiso
                },
                select: {
                    p_id: true
                }
            })
            // agregarlo a la N a N
            let p_rol = await prisma.permiso_rol.create({
                data: {
                    fk_rol: response.r_id,
                    fk_permiso: p_id 
                }
            })
        }
        res.json(response);
    }
    if(req.method === "GET"){
        response = await prisma.rol.findMany();
        res.json(response);
    }
};