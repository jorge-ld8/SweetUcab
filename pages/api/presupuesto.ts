import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';
import superjson from "superjson";
import UserProfile from "../userSession";
import ProductoPost from "../producto/[id]";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let oferta = null, response = null;
    if(req.method === "POST"){
      //variable monto_total
      let monto_total = 0;
      //hallar el cliente
      let usuarioActual = await prisma.usuario.findUnique({
          where: {
              u_username: superjson.parse(req.body)['username'],
          },
          select: {
              fk_cliente_juridico: true,
              fk_cliente_natural: true
          }
      })
    //fk's posibles
      let fk_juridico = null, fk_natural = null;
      if(usuarioActual.fk_cliente_juridico)
          fk_juridico = usuarioActual.fk_cliente_juridico;
      else
          fk_natural = usuarioActual.fk_cliente_natural;
      //crear el presupuesto
      let presupuesto = await prisma.presupuesto.create({
          data: {
              p_fecha_creacion: superjson.parse(req.body)['fecha_creacion'] ? new Date(superjson.parse(req.body)["fecha_creacion"]) : new Date(),
              p_total_presupuesto: 0,
              fk_cliente_juridico: fk_juridico,
              fk_cliente_natural: fk_natural
          }
      });
    //   res.json(superjson.parse(req.body)['lista_presupuesto']);

    //   //ciclo por el array pasado al presupuseto
      for(let entradaP of superjson.parse(req.body)['lista_presupuesto']){
        //sacar fk producto y precio
        let producto = await prisma.producto.findFirst({
            where:{
                p_nombre: entradaP[0],
            },
            select: {
                p_id: true,
                p_precio_actual: true
            }
        });
        let cantidad = Number(entradaP[1]);
        monto_total += cantidad * Number(producto.p_precio_actual);
        //crear registro en la n a n
      let registroNaN = await prisma.producto_presupuesto.create({
        data:{
            p_cantidad: cantidad,
            p_precio_por_unidad: Number(producto.p_precio_actual),
            fk_presupuesto: presupuesto.p_id,
            fk_producto: producto.p_id
        }
      })
    }
     //update presupuesto con monto_total
       let pres = await prisma.presupuesto.update({
           where:{
            p_id: presupuesto.p_id,
           },
           data:{
            p_total_presupuesto: monto_total
           }
       }) 
       res.json(pres);
    }
      // 
    else if(req.method === "GET"){
        response = await prisma.presupuesto.findMany();
        res.json(response);
    }
};      
