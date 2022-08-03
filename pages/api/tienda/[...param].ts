import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../lib/prisma';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let cliente_juridico = null, response = null;
    const {param} = req.query;

    if(req.method === "POST"){
        let nombreTienda = String(param[0]); //nombre tienda
        let nroProducto = String(param[1]); //numero producto
        
        const tiendaActual = await prisma.tienda.findFirst({
            where:{
                t_nombre: nombreTienda,
            }
        })

        // buscar a ver si hay el inventario del producto
        let productoAnaquelActual= await prisma.producto_anaquel.findMany({
            where:{   //PARA REBAJAR EL INVENTARIO SOLO CAMBIAR EL FIND POR UN UPDATE
                AND: [
                    {  
                        fk_producto: Number(nroProducto),
                    },
                    {
                        anaquel:{
                            zona_pasillo:{
                                pasillo:{
                                    almacen:{
                                        tienda:{
                                            t_id: tiendaActual.t_id,
                                        }
                                    }
                                }
                            }
                        }
                    }
                ],
            },
        });

        let cantidad=[];
        for(let prodA of productoAnaquelActual){
            cantidad.push(prodA.p_cantidad);
        }

        res.json({cantidad: cantidad ?? [0]});
    }
};