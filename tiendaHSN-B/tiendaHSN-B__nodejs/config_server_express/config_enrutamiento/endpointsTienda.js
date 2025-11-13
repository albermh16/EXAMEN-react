//modulo de codigo para definir endpoints de la zona de tienda
const express = require('express');
const mongoose = require('mongoose');
const objetoRouterTienda = express.Router();

const stripeService = require('../../servicios/stripeService');
const paypalService = require('../../servicios/paypalService');

objetoRouterTienda.get('/Categorias', 
    async (req,res,next)=>{ 
        try {
            //en los parametros de la url viene el pathCategoria a buscar en tabla categorias de mongodb
            //cliente REACT envia:  http://localhost:3000/api/Tienda/Categorias ? pathCat=principales
            console.log(`parametros en URL pasados desde react: ${JSON.stringify(req.query)}`);

            const pathCategoria = req.query.pathCat; //<--- si vale "principales" quiero buscar categorias raices, sino subcategorias de la categoria q me pasan

            let patronBusqueda=pathCategoria==="principales" ? /^\d+$/ : new RegExp(`^${pathCategoria}-\\d+`); 

            await mongoose.connect(process.env.URL_MONGODB);
            let categoriasCursor=mongoose.connection
                                        .collection('categorias')
                                        .find( { pathCategoria: patronBusqueda} );
            
            let categoriasArray=await categoriasCursor.toArray();
            console.log(`categoriasArray recuperadas: ${JSON.stringify(categoriasArray)}`);

            res.status(200).send(
                 {
                        codigo:0,
                        mensaje: `categorias recuperadas ok para pathCategoria: ${pathCategoria}`,
                        categorias: categoriasArray
                }
            );
        

        } catch (error) {
            console.log(`error al recuperar categorias: ${error}`);
            res.status(200)
                .send(
                    {
                         codigo:5, 
                         mensaje:`error al recuperar categorias: ${error}`,
                        categorias:[]
                    }
                );
        }
    }
)

objetoRouterTienda.get('/Productos',async (req,res,next)=>{
    try {
        //...pasamos en la query la categoria a seleccionar, parametro pathCat <--- si vale "raices" pues recupero
        //productos de categorias principales, sino los productos de esa categoria...   
        let pathCategoria=req.query.pathCat;
        console.log(`pathCategoria recibida en query: ${pathCategoria}`)
        
        //si categoria es de 2º nivel, recuperamos productos que CONTENGAN el path...si es de 3º nivel, tienen q coincidir exactamente con ese pathCategoria
        let patron=pathCategoria.split('-').length == 2 ? new RegExp(`^${pathCategoria}-`) : new RegExp(`^${pathCategoria}$`);

        await mongoose.connect(process.env.URL_MONGODB);
        let _prodCursor=mongoose.connection.collection('productos').find( { pathCategoria: { $regex: patron } } );
        let _productos=await _prodCursor.toArray();

        console.log(`productosArray recuperados: ${JSON.stringify(_productos)}`);
        res.status(200).send( { codigo: 0, mensaje: 'productos recuperados ok...', productos: _productos } );

    } catch (error) {
        console.log('error recuperar productos  ', error);            
        res.status(200).send({codigo:1, mensaje:'error recuperando productos ...' + error, productos:[] });
    }
})

objetoRouterTienda.post('/FinalizarCompra', async (req,res,next)=>{
    try {
        //...endpoint para finalizar compra, invocado desde componente React: Finalizar.jsx...
        //en el req.body vienen los datos del cliente y del pedido a procesar
        const { cliente, pedido } = req.body;
        console.log('datos recibidos en endpoint FinalizarCompra, cliente y pedido:', cliente, pedido);

        switch (pedido.metodoPago.tipo) {
            case 'PayPal':
                //1º paso:aqui invocariamos la API de Paypal para procesar el pago usando servicio paypalService.js...
                pedido._id=new mongoose.Types.ObjectId();
                
                const orderPayload = await paypalService.Stage1_createOrderPayPal( cliente._id, pedido );
                if(! orderPayload ) throw new Error('No se ha podido crear la orden de pago en PayPal');

                //2º paso: almacenamos en mongodb el id del objeto ORDER de PayPal en el pedido del cliente
                //en propiedad "pedidos" del cliente metemos objeto pedido en el array con propiedad "metodoPago"
                //asi: { tipo: 'PayPal'. detalles: { estado:'PENDING', idOrderPayPal: ....}}
                pedido.metodoPago={ tipo: 'PayPal', detalles: {estado:'PENDING', idOrderPayPal:orderPayload.id } };

                await mongoose.connect(process.env.URL_MONGODB);
                let pedidosUpdate=await mongoose.connection
                                                .collection('clientes')
                                                .updateOne(
                                                    { 'cuenta.email': cliente.cuenta.email},
                                                    { $push: { pedidos: pedido }}
                                                );


                //3º paso: mandamos respuesta al cliente REACT con los datos de la orden creada en PayPal con la url a cargar
                //en popup
                const urlAprobacion=orderPayload.links.find(link => link.rel === 'approve')?.href;
                res.status(200).send( 
                                    {
                                        codigo: 0, 
                                        mensaje: 'orden de pago creada ok en PayPal', 
                                        orderIdPayPal: orderPayload.id,
                                        urlAprobacionPayPal: urlAprobacion 
                                   } 
                                );
                break;
            

            case 'Tarjeta de Credito/Debito':
                //...aqui invocariamos la API de la pasarela de pago para procesar el pago con tarjeta con STRIPE usando servicio stripeService.js...
                //antes de crear el objeto Customer de Stripe y Card asociado al mismo comprobamos si en la BD ya existen estos datos para el cliente
                await mongoose.connect(process.env.URL_MONGODB);
                let existePagoConTarjeta=await mongoose.connection
                                                        .collection('clientes')
                                                        .findOne(
                                                            { 'cuenta.email': cliente.cuenta.email, 
                                                              'metodosPago.tipo': { $elemMatch: { tipo: 'Tarjeta de Credito/Debito' } } 
                                                            },
                                                            { metodoPago: 1, _id:0 }
                                                        );
                console.log('existePagoConTarjeta en BD para este cliente:', existePagoConTarjeta);

                let customerIdStripe;
                let cardIdStripe;

                if( !existePagoConTarjeta ){
                    //...no existe este metodo de pago para el cliente, creamos Customer y Card en Stripe y guardamos datos en BD...
                    customerIdStripe=await stripeService.Stage1_CreateCustomer( 
                                                                                    cliente.nombre, 
                                                                                    cliente.apellidos,
                                                                                     cliente.cuenta.email,
                                                                                      pedido.datosEnvio
                                                                                )
                    if(! customerIdStripe) throw new Error('No se ha podido crear el CUSTOMER en Stripe');

                    cardIdStripe=await stripeService.Stage2_CreateCardForCustomer( customerIdStripe, pedido.metodoPago.detalles );
                    if(! cardIdStripe) throw new Error('No se ha podido crear la CARD en Stripe para el CUSTOMER');

                    //...guardamos en BD los datos del metodo de pago para este cliente...
                    let updateMetodoPagoResult=await mongoose.connection
                                                                .collection('clientes')
                                                                .updateOne(
                                                                    { 'cuenta.email': cliente.cuenta.email },
                                                                    { $push: 
                                                                            { 
                                                                                metodosPago: { 
                                                                                                tipo: 'Tarjeta de Credito/Debito',
                                                                                                detalles: { idCustomer: customerIdStripe, idCard: cardIdStripe } 
                                                                                            }
                                                                                } 
                                                                    }
                                                                );
                    console.log('resultado de guardar metodo de pago en BD para el cliente:', updateMetodoPagoResult);
                    if(updateMetodoPagoResult.modifiedCount !== 1) throw new Error('No se han podido guardar los datos del metodo de pago en la BD para el cliente');

                } else {
                    //...ya existe este metodo de pago para el cliente, usamos esos datos para procesar el pago...
                    customerIdStripe = existePagoConTarjeta.metodoPago[0].detalles.idCustomer;
                    cardIdStripe = existePagoConTarjeta.metodoPago[0].detalles.idCard;
                }

                //3º paso: crear el cargo asociado al cliente CUSTOMER y al metodo de pago CARD del 1º y 2º paso
                pedido._id= new moongoose.Types.ObjectId(); //creamos un nuevo _id para el pedido
                let cargoResult=await stripeService.Stage3_CreateChargeForCustomer(
                                                            customerIdStripe,
                                                            cardIdStripe,
                                                            pedido.total,
                                                            pedido._id.toString()
                                                         );
                if(! cargoResult) throw new Error('No se ha podido crear el CHARGE en Stripe para el CUSTOMER y CARD indicados');

                //generar una factura en PDF del pedido y mandarla por email al cliente...paquete IRONPDF

                //actualizamos la base de datos con el nuevo pedido realizado por el cliente...en propiedad PEDIDOS del cliente
                let updatePedidosClienteResult=await mongoose.connection
                                                            .collection('clientes')
                                                            .updateOne(
                                                                { 'cuenta.email': cliente.cuenta.email },
                                                                { $push: { pedidos: pedido } }
                                                            );
                console.log('resultado de guardar el pedido en BD para el cliente:', updatePedidosClienteResult);
                if(updatePedidosClienteResult.modifiedCount !== 1) throw new Error('No se ha podido guardar el pedido en la BD para el cliente');
                
                //mandamos respuesta de ok al cliente de REACT
                res.status(200).send( { codigo: 0, mensaje: 'pago con tarjeta procesado ok y pedido guardado en BD para el cliente' } );
                
                break;

            
            case 'Bizum':
                //...aqui invocariamos la API de Bizum para procesar el pago usando Bizum...
                break;

            default:
                break;
        }

    } catch (error) {
        console.log('error en endpoint FinalizarCompra: ', error);
        res.status(200).send( { codigo: 9, mensaje: 'error al procesar la compra: ' + error } );
    }
})

objetoRouterTienda.get('/PaypalCallback', async (req,res,next)=>{
    try {
        //...endpoint para procesar el callback de PayPal una vez el usuario ha aprobado o cancelado el pago en la ventana popup de PayPal...
        //en la url en el query-string vienen los parametros: idCliente, idPedido de mongodb, de forma opcional: cancel=true,  <--- creados por mi al crear la url de retorno
        //  token  y PayerID (id del comprador en PayPal) <--- estos los añade paypal al redireccionar a este endpoint
        console.log(`parametros recibidos en query-string del callback de PayPal: ${JSON.stringify(req.query)}`);
        const {idCliente, idPedido, token, PayerId, cancel} = req.query;
        
        //si existe el parametro cancel=true es que el usuario ha cancelado el pago en PayPal
        if(cancel && cancel === 'true') throw new Error('El usuario ha cancelado el pago en PayPal');

        //procesamos el pago capturando la orden en PayPal usando servicio paypalService.js, necesito recupear el id de Order de Paypal creado en el 1º paso de finalizar compra
        //lo tengo q recuperar de la BD en el pedido del cliente en estado PENDING
        await mongoose.connect(process.env.URL_MONGODB);
        let PedidoPayPal=await mongoose.connection
                                        .collection('clientes')
                                        .findOne(
                                            { _id: new mongoose.Types.ObjectId(idCliente), 
                                              pedidos:{$elemMatch:{_id:new mongoose.Types.ObjectId(idPedido), 'metodoPago.tipo':'PayPal','metodoPago.detalles.estado':'PENDING'}}
                                            },
                                            { 'pedidos.$': 1, _id:0 } 
                                            
                                        );
        console.log('PedidoPayPal recuperado de BD para capturar orden de PayPal:', PedidoPayPal.pedidos[0])
        if (!PedidoPayPal || PedidoPayPal.pedidos.length === 0) throw new Error('No se ha podido recuperar el pedido en estado PENDING para capturar la orden de PayPal');

        const idOrderPayPal=PedidoPayPal.pedidos[0].metodoPago.detalles.idOrderPayPal;

        const capturaResult=await paypalService.Stage2_captureOrderPayPal( idOrderPayPal );
        if(! capturaResult ) throw new Error('No se ha podido capturar la orden de PayPal');
        //actualizamos el estado del metodo de pago en el pedido del cliente de PENDING a COMPLETED en la bd en propiedad metodoPago.detalles.estado

        if (capturaResult.status !== 'COMPLETED') throw new Error(`La captura de la orden de PayPal no se ha completado correctamente, estado actual: ${capturaResult.status}`);
        let updateEstadoPagoResult=await mongoose.connection
                                                .collection('clientes')
                                                .updateOne(
                                            { 
                                              _id: new mongoose.Types.ObjectId(idCliente), 
                                              pedidos:{$elemMatch:{_id:new mongoose.Types.ObjectId(idPedido), 'metodoPago.tipo':'PayPal','metodoPago.detalles.estado':'PENDING'}}
                                            },
                                            {
                                              $set: {
                                                'pedidos.$.metodoPago.detalles.estado': 'COMPLETED',
                                                'pedidos.$.metodoPago.detalles.capturaResult': capturaResult
                                              }
                                            }
                                        );
        //1º problema: SI DEVUELVO UN JSON el popup como no tiene codigo js para procesarlo me lo muestra tal cual en pantalla
        //res.status(200).send( { codigo: 0, mensaje: 'callback de PayPal recibido ok...' } );
        
        //2º problema: si hago un res.redirect a una pagina de confirmacion de pedido en React, el popup carga esa pagina y tengo dos ventanas abiertas con el portal
        //¿posible solucion? la ventana padre debe con un timer chequear la url del popup y si detecta q aparece la url de FinPdidoOK en el popup, lo cierra y lo carga el
        //inconveniente q puede aparecer en un momento la ventana popup con la pagina de confirmacion de pedido y la del padre tambien con esa pagina...no es muy elegante pero funciona
        //res.status(200).redirect(`http://localhost:5173/Pedido/FinPedidoOK?idCliente=${idCliente}&idPedido=${idPedido}&idOrderPayPal=${idOrderPayPal}`);

        //3º forma mas elegante: es mandar codigo javascript al popup para que se cierre y comunique a la ventana padre donde tiene q ir con los datos del pedido de paypal
        res.status(200).send(
            ` <!DOCTYPE html>
                <html>
                <body>
                    <script>
                        window.opener.postMessage({
                            idCliente: '${idCliente}',
                            idPedido: '${idPedido}',
                            captureOrder: '${JSON.stringify(capturaResult)}'
                        }, '*');
                        window.close();
                    </script>
                </body>
                </html>
            `
        )

    } catch (error) {
        console.log('error en endpoint PaypalCallback: ', error);
        //res.status(200).send( { codigo: 9, mensaje: 'error en callback de PayPal: ' + error } );
        //res.status(200).redirect(`http://localhost:5173/Pedido/FinPedidoOK?idCliente=${idCliente}&idPedido=${idPedido}&idOrderPayPal=${idOrderPayPal}&cancel=true`);
        res.status(200).send(
            ` <!DOCTYPE html>
                <html>
                <body>
                    <script>
                        window.opener.postMessage({
                            idCliente: '${idCliente}',
                            idPedido: '${idPedido}',
                            cancel: true
                        }, '*');
                        window.close();
                    </script>
                </body>
                </html>
            `
        )

    }
});

module.exports = objetoRouterTienda;