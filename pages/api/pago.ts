import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';
import fs from 'fs';
import { transaccion_compra } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let response = null;

    const CANTIDAD_PRODS_ALMACEN = 100
    const CANTIDAD_PRODS_FABRICA = 10000;
    
    if(req.method === "POST"){
        let usuario = await prisma.usuario.findUnique({
            where:{
                u_username: JSON.parse(req.body)['username'],
            },
            select:{
                fk_cliente_juridico: true,
                fk_cliente_natural: true
            }
        })

        if(usuario.fk_cliente_natural){
            await prisma.cliente_natural.update({
                where:{
                    c_id: usuario.fk_cliente_natural,
                },
                data:{
                    c_cantidad_puntos:{
                        increment: 5,
                    }
                }
            })
        }
        else if(usuario.fk_cliente_juridico){
            await prisma.cliente_juridico.update({
                where:{
                    c_id: usuario.fk_cliente_juridico,
                },
                data:{
                    c_cantidad_puntos:{
                        increment: 5,
                    }
                }
            })
        }

        let montoTotal = 0;
        for(let prodCant of JSON.parse(req.body)['carrito']){
            montoTotal +=  prodCant[1] * prodCant[0].p_precio_actual; //cantidad por precio
        }
    
        //crear transaccion compra
        let transaccionCompra = await prisma.transaccion_compra.create({
            data:{
                t_total_compra:  montoTotal,
                t_en_linea: Boolean(JSON.parse(req.body)['en_linea']),
                t_fecha_creacion: new Date(),
                fk_tienda: JSON.parse(req.body)['tienda'],
                fk_cliente_juridico: usuario.fk_cliente_juridico ?? null,
                fk_cliente_natural: usuario.fk_cliente_natural ?? null,
            }
        });
        let estatusCompra;
        if(JSON.parse(req.body)['en_linea']){
            estatusCompra = 1;
        }
        else{
            estatusCompra = 6; 
        }
        // crear estatus de transaccion recien creada
        const estatus_transaccion = await prisma.estatus_transaccion.create({
            data:{
                e_fecha_hora_establecida: new Date(),
                fk_estatus: estatusCompra,
                fk_transaccion_compra: transaccionCompra.t_id,
            }
        });

        // agarrar los productos pasados y registrar cada uno de ellos
        for(let prodCant of JSON.parse(req.body)['carrito']){
            
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
                select:{
                    p_id: true,
                    fk_anaquel: true,
                    fk_producto: true,
                    p_cantidad: true,
                    anaquel:{
                        select:{
                            zona_pasillo:{
                                select:{
                                    pasillo:{
                                        select:{
                                            almacen: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            if(productoAnaquelActual){
                let newCompra = await prisma.compra.create({
                    data:{
                        c_precio_por_unidad: prodCant[0].p_precio_actual,
                        c_cantidad: prodCant[1],
                        fk_producto: prodCant[0].p_id,
                        fk_transaccion_compra: transaccionCompra.t_id,
                        fk_producto_anaquel_anaquel: productoAnaquelActual.fk_anaquel,
                        fk_producto_anaquel_id: productoAnaquelActual.p_id,
                        fk_producto_anaquel_producto: productoAnaquelActual.fk_producto,
                    }
                })
                if(!(JSON.parse(req.body)['en_linea'])){
                    //decrementar el inventario del anaquel una vez se concreto la compra
                    let newInventarioProdAnaquel = await prisma.producto_anaquel.updateMany({
                        where: {
                            p_id: productoAnaquelActual.p_id,
                        },
                        data:{
                            p_cantidad:{
                                decrement: prodCant[1],
                            } 
                        }
                    });
    
                    let currPA = await prisma.producto_anaquel.findFirst({
                        where:{
                            p_id: productoAnaquelActual.p_id
                        }
                    })
    
                    //si hay menos de 20 unidades en el anaquel despues de haber decrementado el inventario
                    if(currPA.p_cantidad <= 20){
                        //generacion de orden de pedido interno
                        let newProdAnaquel = await prisma.pedido_interno.create({
                            data:{
                                p_fecha_creacion: new Date(),
                                fk_almacen: productoAnaquelActual.anaquel.zona_pasillo.pasillo.almacen.a_id,
                                fk_producto_anaquel_id: productoAnaquelActual.p_id,
                                fk_producto_anaquel_anaquel: productoAnaquelActual.fk_anaquel,
                                fk_producto_anaquel_producto: productoAnaquelActual.fk_producto, 
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
                                fk_producto: productoAnaquelActual.fk_producto,
                            }
                        });
                    }
                }

            }
            
            // let currPA = await prisma.producto_anaquel.findFirst({where: {p_id: productoAnaquelActual.p_id}});

 
        }

        // buscar el cliente correspondiente al usuario
        let usuarioActual = await prisma.usuario.findUnique({
            where: {
                u_username: JSON.parse(req.body)["username"]
            },
            select:{
                cliente_juridico: { 
                    select:{
                        c_id: true,
                        c_cantidad_puntos: true
                    }
                },
                cliente_natural: {
                    select: {
                        c_id: true,
                        c_cantidad_puntos: true
                    }
                }
        }});
        
        //PARTE PAGO -
        //crear transaccion_compra con el monto total calculado -
        let metodos = JSON.parse(req.body)['metodos'];
        let pagosExitosos = []; //array que contiene los pagos registrados que posteriormente se devolveran
        
        //for metodo en metodos
        for(let metodo of metodos){
        //  if tipo !== "" y monto > 0 
            if(metodo.tipo !== "" && metodo.monto > 0){
                // consigues el metodo de pago
                let metodoID = await prisma.metodo_pago_cliente.findFirst({
                        where:{
                            AND:[
                                {   
                                    OR:[
                                        {
                                        fk_cliente_juridico: usuario.fk_cliente_juridico !== null ? usuario.fk_cliente_juridico : undefined,
                                    }, 
                                    {
                                         fk_cliente_natural: usuario.fk_cliente_natural !== null ? usuario.fk_cliente_natural : undefined,
                                    }
                                    ]
                                },

                                {
                                    [metodo.tipo]:{
                                        [metodo.tipo[0] + "_nombre"]:{
                                            contains:  metodo.tipo,
                                            mode: 'insensitive',
                                        }
                                    }
                                },
                            ]   
                        }
                    }
                )

        //      crear nueva entrada en la tabla pago
        //      con fk_metodo = tipo y fk_compra = compra creada y monto_pago = monto
                let newPago = await prisma.pago.create({
                    data:{
                        p_monto_pago: metodo.monto,
                        [`fk_${metodo.tipo}`]: metodoID[`fk_${metodo.tipo}`],
                        fk_transaccion_compra: transaccionCompra.t_id,
                        p_fecha: new Date(),
                    }
                });
                pagosExitosos.push(newPago);
            }
        }

        // PAGO CON PUNTOS
        //if puntoVal > 0 
        let puntoVal = Number(JSON.parse(req.body)['puntoVal']);
        if(puntoVal && puntoVal > 0){
             //  crear nueva entrada en entidad punto con fk historico punto actual
            //      buscar punto actual
            let puntoActual = await prisma.historico_punto.findFirst({
                where:{
                    h_fecha_final: null 
                }
            })
            
            let nuevoMetodoPagoPunto = await prisma.punto.create({
                data:{
                    p_nombre: "punto",
                    p_descripcion: "Pago con punto",
                    fk_historico_punto: puntoActual.h_id
                }
            })

            let newPago = await prisma.pago.create({
                data:{
                    p_monto_pago: Number(puntoActual.h_valor) * puntoVal,
                    fk_punto: nuevoMetodoPagoPunto.p_id,
                    fk_transaccion_compra: transaccionCompra.t_id,
                    p_fecha: new Date(),
                }
            })
            pagosExitosos.push(newPago);
            //descontar puntos
                //buscar cliente con el id y quitarle punto val
            if(usuario.fk_cliente_juridico){
                //cliente juridico
                await prisma.cliente_juridico.update({
                    where:{
                       c_id: usuario.fk_cliente_juridico 
                    },
                    data:{
                        c_cantidad_puntos: {
                            decrement: puntoVal,
                        },
                    }
                });
            }
            else if(usuario.fk_cliente_natural){
                await prisma.cliente_natural.update({
                    where:{
                        c_id: usuario.fk_cliente_natural 
                     },
                     data:{
                        c_cantidad_puntos:{
                            decrement: puntoVal,
                        },
                     }
                });
            }
        }
        //RESPUESTA API 
        res.json({t_compra: transaccionCompra, pagos: pagosExitosos });
    }
    if(req.method === "GET"){
        res.json(response);
    }
};