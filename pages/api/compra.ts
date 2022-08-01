
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let response = null, relPresente = JSON.parse(req.body)['relacion'];
    let objeto = null;
    let montoTotal = 0;
    for(let prodCant of JSON.parse(req.body)['prods']){
        montoTotal += prodCant[1] * prodCant[0].p_precio_actual;
    }
    
    if(req.method === "POST"){
        let montoTotal = 0
        let en_linea = true
        if(JSON.parse(req.body)['en_linea']){
            en_linea = true;
        }
        else{
            en_linea = false
        }
        //si la compra es en linea
        objeto = await prisma.transaccion_compra.create({
            data:{
                t_total_compra: montoTotal,
                t_en_linea: en_linea,
                t_fecha_creacion: new Date(),
                fk_tienda: Number(JSON.parse(req.body))['tienda'],
                fk_cliente_juridico: JSON.parse(req.body)['cliente_juridico'],
                fk_cliente_natural: JSON.parse(req.body)['cliente_natural']
            }
        })
        for(let prodCant of JSON.parse(req.body)['prods']){
            let newCompra = await prisma.compra.create({
                data:{
                    c_precio_por_unidad: prodCant[0].p_precio_actual,
                    c_cantidad: prodCant[1],
                    fk_producto: prodCant[0].p_id,
                    fk_transaccion_compra: objeto.t_id,
                }
            })
        }
        let compra = await prisma.transaccion_compra.create({
            data:{
                t
            }
        })
        objeto = await prisma.lugar.findFirst({
            where: {
                l_descripcion:  String(JSON.parse(req.body)['relacion']),
            },
            select: {
                l_id: true
            }
        })
        response = await prisma.lugar.create({
            data: {
                l_descripcion: String(JSON.parse(req.body)['descripcion']),
                l_tipo: String(JSON.parse(req.body)['tipo']), 
                fk_lugar: relPresente ?  Number(objeto.l_id) : null 
            }
    })
        res.json(response);
    }
    if(req.method === "GET"){
        response = await prisma.lugar.findMany();
        res.json(response);
    }
};