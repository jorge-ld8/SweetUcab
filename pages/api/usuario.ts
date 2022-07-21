import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';
import superjson from "superjson";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let response = null,  JSONbody = superjson.parse(req.body);
    let objeto = null, objeto2 = null, objeto3 = null, objeto4 = null;
    response = JSONbody;
    if(req.method === "POST"){
        objeto2 = await prisma.rol.findFirst({
                 where: {
                     r_tipo: String(superjson.parse(req.body)['fk_rol'])
                 },
                 select: {
                     r_id: true
                 }
             })
        if(superjson.parse(req.body)['fk_empleado']){
            objeto =  await prisma.empleado.findFirst({
                where: {
                    e_cedula: superjson.parse(req.body)['fk_empleado'],
                },
                select: {
                    e_id: true
                }
            })
        }
        else if(superjson.parse(req.body)['fk_c_juridico']){
            objeto3 =  await prisma.cliente_juridico.findFirst({
                where: {
                    c_rif: superjson.parse(req.body)['fk_c_juridico'],
                },
                select: {
                    c_id: true
                }
            })
        }
        else if(superjson.parse(req.body)['fk_c_natural']){
            objeto4 =  await prisma.cliente_natural.findFirst({
                where: {
                    c_cedula: superjson.parse(req.body)['fk_c_natural'],
                },
                select: {
                    c_id: true
                }
            })
        }
        response = await prisma.usuario.create({
            data: {
                u_username: superjson.parse(req.body)['username'],
                u_email: superjson.parse(req.body)['email'],
                u_password: superjson.parse(req.body)['password'],
                fk_rol: objeto2 ? Number(objeto2.r_id) : null,
                fk_empleado: objeto ? Number(objeto.e_id): null,  //calcular cual es la fk de usuario
                fk_cliente_juridico: objeto3 ? Number(objeto3.c_id) : null,
                fk_cliente_natural: objeto4 ? Number(objeto4.c_id) : null,
            }
        });
        res.json(response);
       }
    else if(req.method === "GET"){
         let response = await prisma.usuario.findMany();
         res.json(response);
    }
};