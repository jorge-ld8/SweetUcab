import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';

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

        const p_interno = await prisma.pedido_interno.findUnique({
            where:{
                p_id: Number(JSON.parse(req.body)['p_interno']),
            },
            select:{
                p_id: true,
                producto_anaquel:{
                    select:{
                        anaquel:{
                            select:{
                                zona_pasillo:{
                                    select:{
                                        pasillo:{
                                            select:{
                                                almacen: true,
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                fk_producto_anaquel_id: true,  
                fk_almacen: true, 
                fk_producto_anaquel_producto: true,
            }
        })

        if(estatus.e_id === 6){ 
            //estatus es entregado
            // buscar a 
            let eInternoActual = await prisma.producto_anaquel.updateMany({
                where:{
                    p_id: p_interno.fk_producto_anaquel_id,
                },
                data:{
                    p_cantidad:{
                        increment: Number(JSON.parse(req.body)['cantidad']),
                    }
                }
            })
        }

            let estatusPInterno = await prisma.estatus_pedido_interno.updateMany({
                where:{
                    e_fecha_hora_fin: null
                },
                data:{
                    e_fecha_hora_fin: new Date()
                }
            })

            //nuevo Estatus d
            let newEstatusPInterno = await prisma.estatus_pedido_interno.create({
                data:{
                    e_fecha_hora_inicio: new Date(),
                    fk_estatus: estatus.e_id,
                    fk_pedido_interno: p_interno.p_id,
                }
            })

            let almacen = await prisma.producto_almacen.updateMany({
                where:{
                    fk_almacen: p_interno.fk_almacen,
                    fk_producto: p_interno.fk_producto_anaquel_producto,
                },
                data:{
                    p_cantidad:{
                        decrement: CANTIDAD_PRODS_ALMACEN,
                    }
                }
            })

            let newAlmacen = await prisma.producto_almacen.findFirst({
                where:{
                    fk_almacen: p_interno.fk_almacen,
                    fk_producto: p_interno.fk_producto_anaquel_producto,
                },
            })

            if(newAlmacen.p_cantidad <= 100){
                //orden a la fabrica
                let newProdAnaquel = await prisma.pedido_fabrica.create({
                    data:{
                        p_fecha_creacion: new Date(),
                        fk_tienda: 1
                    }
                })

                //nuevo Estatus d
                let newEstatusPInterno = await prisma.estatus_pedido.create({
                    data:{
                        e_fecha_hora_inicio: new Date(),
                        fk_estatus: 1,
                        fk_pedido_fabrica: newProdAnaquel.p_id
                    }
                })

                //detalle de la orden de pedido interno
                let newDetallePAnaquel = await prisma.detalle_pedido.create({
                    data:{
                        d_cantidad: CANTIDAD_PRODS_FABRICA,
                        fk_pedido_fabrica: newProdAnaquel.p_id,
                        fk_producto: p_interno.fk_producto_anaquel_producto,
                    }
                });
            }

            //decrementar al almacen
           
        res.json(newEstatusPInterno);
    }
    if(req.method === "GET"){
        response = await prisma.rol.findMany();
        res.json(response);
    }
};