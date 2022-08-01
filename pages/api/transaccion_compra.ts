import { producto_anaquel } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let response = null, relPresente = JSON.parse(req.body)['relacion'];
    let transaccion_compra = null;
    let montoTotal = 0;
    for(let prodCant of JSON.parse(req.body)['prods']){
        montoTotal += prodCant[1] * prodCant[0].p_precio_actual; //cantidad por precio 
    }

    let en_linea; //variable que determina si la compra fue en linea o no (fisica)
    if(req.method === "POST"){
        if(JSON.parse(req.body)['en_linea']){
            en_linea = true;
        }
        else{
            en_linea = false
        }
        
        //crear transaccion compra
        transaccion_compra = await prisma.transaccion_compra.create({
            data:{
                t_total_compra: montoTotal,
                t_en_linea: en_linea,
                t_fecha_creacion: new Date(),
                fk_tienda: Number(JSON.parse(req.body))['tienda'],
                fk_cliente_juridico: JSON.parse(req.body)['cliente_juridico'],
                fk_cliente_natural: JSON.parse(req.body)['cliente_natural']
            }
        })

        //agarrar los productos pasados y registrar cada uno de ellos
        for(let prodCant of JSON.parse(req.body)['prods']){
            
            //subconsulta en la que se seleccionan todos los productos anaqueles que tengan ese producto y con la cantidad que se quiere
            let productoAnaquelActual= await prisma.producto_anaquel.findFirst({
                where:{   //PARA REBAJAR EL INVENTARIO SOLO CAMBIAR EL FIND POR UN UPDATE
                    AND: [
                        {  
                            fk_producto: prodCant[0].p_id
                        },
                        {
                            p_cantidad: {
                                gte: prodCant[1]
                            }
                        },
                        {
                            anaquel:{
                                zona_pasillo:{
                                    pasillo:{
                                        almacen:{
                                            tienda:{
                                                t_id: Number(JSON.parse(req.body)['tienda']),
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ],
                },
            });

            // //buscar todos los almacenes, todas las zona_pasillo y todos los anaqueles en los que este el producto
            // let almacenList = await prisma.almacen.findMany({
            // where:{
            //     fk_tienda: Number(JSON.parse(req.body)['tienda']),
            // },
            // select: {
            //         pasillo:{
            //             select:{
            //                 zona_pasillo: {
            //                     select: {
            //                         anaquel: {
            //                             select:{
            //                                 producto_anaquel: {
            //                                     where:{
            //                                         fk_producto: prodCant[0].p_id     
            //                                     }
            //                                 }
            //                             }
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     },
            // });


            // //Apenas se consiga un producto_anaquel cuya cantidad sea suficiente para registrar la compra se toma
            // outerLoop: for(let almacen of almacenList){
            //     for(let pasillo of almacen.pasillo){
            //         for(let zona_pasillo of pasillo.zona_pasillo){
            //             for(let anaquel of zona_pasillo.anaquel){
            //                 for(let p_anaquel of anaquel.producto_anaquel){
            //                     if(p_anaquel.p_cantidad >= prodCant[1]){
            //                         productoAnaquelActual = p_anaquel
            //                         break outerLoop
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }

            // registrar cada una de las compras de producto
            if(productoAnaquelActual){
                let newCompra = await prisma.compra.create({
                    data:{
                        c_precio_por_unidad: prodCant[0].p_precio_actual,
                        c_cantidad: prodCant[1],
                        fk_producto: prodCant[0].p_id,
                        fk_transaccion_compra: transaccion_compra.t_id,
                        fk_producto_anaquel_anaquel: productoAnaquelActual.fk_anaquel,
                        fk_producto_anaquel_id: productoAnaquelActual.p_id,
                        fk_producto_anaquel_producto: productoAnaquelActual.fk_producto,
                    }
                })
            }
        }
        res.json(transaccion_compra);
    }
    if(req.method === "GET"){
        response = await prisma.lugar.findMany();
        res.json(response);
    }
};