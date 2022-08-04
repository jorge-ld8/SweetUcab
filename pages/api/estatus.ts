import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';
import fs from 'fs';
import { CompressSharp } from "@mui/icons-material";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let cliente_juridico = null, response = null;

    const CANTIDAD_PRODS_ALMACEN = 100
    const CANTIDAD_PRODS_FABRICA = 10000;
    
    if(req.method === "POST"){
        // buscar estatus con nombre actual
        const estatus = await prisma.estatus.findFirst({
            where:{
                e_nombre: JSON.parse(req.body)['estatus'],
            }
        });

        const t_compra = await prisma.transaccion_compra.findUnique({
            where:{
                t_id: Number(JSON.parse(req.body)['transaccion']),
            },
            include:{
                compra: true,
            }
        })

        if(estatus.e_id === 6){ //estatus es entregado
            //por cada una de las compras
            for(let compra of t_compra.compra){
                let compraActual = await prisma.compra.findFirst({
                    where:{
                        c_id: compra.c_id
                    },
                    include:{
                        producto_anaquel: {
                            select:{
                                anaquel:{
                                    select: {
                                        zona_pasillo: {
                                            select: {
                                                pasillo: {
                                                    select: {
                                                        almacen: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                p_id: true,
                                p_cantidad: true,
                                fk_anaquel: true,
                                fk_producto: true,
                            }
                        },
                    }
                });

                let currProductoAnaquel = compraActual.producto_anaquel;

                //ACTUALIZAR INVENTARIO
                let newInventarioProdAnaquel = await prisma.producto_anaquel.updateMany({
                    where: {
                        p_id: currProductoAnaquel.p_id,
                    },
                    data:{
                        p_cantidad:{
                            decrement: compra.c_cantidad,
                        } 
                    }
                });

                if(currProductoAnaquel.p_cantidad <= 20){ //cantidad restante es menor o igual a 20
                    //generacion de orden de pedido interno
                    let newProdAnaquel = await prisma.pedido_interno.create({
                        data:{
                            p_fecha_creacion: new Date(),
                            fk_almacen: currProductoAnaquel.anaquel.zona_pasillo.pasillo.almacen.a_id,
                            fk_producto_anaquel_id: currProductoAnaquel.p_id,
                            fk_producto_anaquel_anaquel: currProductoAnaquel.fk_anaquel,
                            fk_producto_anaquel_producto: currProductoAnaquel.fk_producto, 
                        }
                    })

                    //nuevo Estatus d
                    let newEstatusPInterno = await prisma.estatus_pedido_interno.create({
                        data:{
                            e_fecha_hora_inicio: new Date(),
                            fk_estatus: 1,
                            fk_pedido_interno: newProdAnaquel.p_id
                        }
                    })

                    //detalle de la orden de pedido interno
                    let newDetallePAnaquel = await prisma.detalle_pedido_interno.create({
                        data:{
                            d_cantidad: CANTIDAD_PRODS_ALMACEN,
                            fk_pedido_interno: newProdAnaquel.p_id,
                            fk_producto: currProductoAnaquel.fk_producto,
                        }
                    });
                }
            }
        }


        // actualizar fecha final del ultimo estado
        const ultimoEstatus = await prisma.estatus_transaccion.updateMany({
            where:{
                e_fecha_fin: null,
                fk_transaccion_compra: Number(JSON.parse(req.body)['transaccion']),
            },
            data:{
                e_fecha_fin: new Date(),
            }
        })

        const estatus_transaccion = await prisma.estatus_transaccion.create({
            data:{
                e_fecha_hora_establecida: new Date(),
                fk_estatus: estatus.e_id,
                fk_transaccion_compra: Number(JSON.parse(req.body)['transaccion']),
            }
        });
        res.json(estatus_transaccion);
    }
    if(req.method === "GET"){
        response = await prisma.rol.findMany();
        res.json(response);
    }
};