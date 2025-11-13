/*
    modulo de codigo q va a exportar un objeto javaScript puro con los metodos para interactuar con la API de PayPal
    van a ser dos los metodos:
    - 1º metodo para crear una orden de pago
    - 2º metodo para capturar el pago de una orden creada
OJO!!! ANTES DE HACER CUALQUIER PETICION usando la API de PayPal HAY QUE AUTENTICARSE (necesitas un token de acceso)
*/

//almaceno en memoria el token de acceso y su fecha de expiracion por si se hacen varias peticiones seguidas
//y lo hubiera generado ya <----- se almacenan en bd vectoriales en memoria, como REDIS, VALKAY, ....
let cacheTokenPayPal={
    accessToken:null,
    expiryTime:null
};

async function getPayPalAccessToken(){
    try {               
        if(cacheTokenPayPal.accessToken == null || (cacheTokenPayPal.accessToken && cacheTokenPayPal.expiryTime > Date.now() ) ) {
            //hay que pedir un nuevo token de acceso
            console.log('Pidiendo nuevo token de acceso a PayPal');
    
            //... codigo para obtener el token de acceso de PayPal
            const petToken=await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token',{
                method:'POST',
                headers:{
                    'Authorization':'Basic '+ Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_CLIENT_SECRET).toString('base64'),
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                body:'grant_type=client_credentials'
            });
            // en la respuesta en el body si es ok tenemos el token de acceso y duracion de expiracion en seg.
            //y la respuesta es erronea el objeto error
            if(!petToken.ok){
                throw new Error('Error al obtener el token de acceso de PayPal');
            } 
            const data=await petToken.json();
            //almacenamos en memoria el token de acceso y su fecha de expiracion
            cacheTokenPayPal.accessToken=data.access_token;
            cacheTokenPayPal.expiryTime=(data.expires_in - 5 * 60) * 1000 + Date.now(); //restamos 5 min para que no caduque justo al usarlo

            return data.access_token;

        } else {
            //usamos el token de acceso almacenado en memoria
            return cacheTokenPayPal.accessToken;
        }

    } catch (error) {
        console.error(error);
        throw new Error(`Error al obtener el token de acceso de PayPal: ${JSON.stringify(error)}`);
    }
}

module.exports = {
    Stage1_createOrderPayPal: async (idCliente, pedido) => {
        try {

            // Obtener token de acceso
            const accessToken = await getPayPalAccessToken();

            // Preparar el body de la petición según la API de PayPal v2
            const orderPayload = {
                intent: 'CAPTURE', // Indica que queremos capturar el pago inmediatamente
                purchase_units: [
                    {
                        items: pedido.itemsPedido.map( item => {
                            return {
                                name: item.producto.Nombre,
                                unit_amount: { currency_code: 'EUR', value: (item.producto.Precio * (1-item.producto.Oferta/100)).toFixed(2) },
                                quantity: item.cantidad
                            }
                        }),
                        amount: {
                            currency_code: 'EUR',
                            value: pedido.total.toFixed(2),
                            //OPCIONAL!!! si quieres desglosar el total en subtotal, impuestos, gastos de envio, etc
                            breakdown: {
                                item_total: { currency_code: 'EUR', value: pedido.subtotal.toFixed(2) },
                                shipping: { currency_code: 'EUR', value: pedido.gastosEnvio.toFixed(2) }
                                //tax_total: { currency_code: 'EUR', value: '0.00' } //si hay impuestos como el IVA
                            }
                            //-------------------------------------------------------------------
                        }
                    }
                ],
                application_context: {
                    return_url: `http://localhost:3000/api/Tienda/PaypalCallback?idCliente=${idCliente}&idPedido=${pedido._id}`,
                    cancel_url: `http://localhost:3000/api/Tienda/PaypalCallback?idCliente=${idCliente}&idPedido=${pedido._id}&cancel=true`
                }
            };

            // Realizar la petición para crear la orden
            const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(orderPayload)
            });

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error en la respuesta de PayPal:', errorData);
                throw new Error(`Error al crear la orden en PayPal: ${JSON.stringify(errorData)}`);
            }

            const orderCreated = await response.json();
            
            console.log('Orden creada exitosamente:', orderCreated.id);
            
            // Devolver todo el objeto ORDER creado por paypal
            return orderCreated

        } catch (error) {
            console.error('Error en Stage1_createOrderPayPal:', error);
            //throw new Error(`Error en Stage1_createOrderPayPal: ${error.message}`);
            return null;
        }
    },
    Stage2_captureOrderPayPal: async (orderId) => {
        try {
            // Validación básica
            if (!orderId) {
                throw new Error('orderId es requerido para capturar la orden');
            }

            // Obtener token de acceso
            const accessToken = await getPayPalAccessToken();

            // Realizar la petición para capturar la orden
            const response = await fetch(
                `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error en la respuesta de PayPal al capturar:', errorData);
                throw new Error(`Error al capturar la orden en PayPal: ${JSON.stringify(errorData)}`);
            }

            const captureData = await response.json();
            
            console.log('Orden capturada exitosamente:', captureData);
            return captureData;

        } catch (error) {
            console.error('Error en Stage2_captureOrderPayPal:', error);
            return null;
            
        }
    }
}