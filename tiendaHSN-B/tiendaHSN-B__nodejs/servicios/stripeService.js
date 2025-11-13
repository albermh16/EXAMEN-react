//modulo de codigo que va a exportar un objeto javascript con metodos para realizar el pago con tarjeta de credito
//usando la API de la plataforma Stripe
//son 3 pasos:
// - 1º paso) crear un cliente dentro de la plataforma de Stripe: objeto CUSTOMER
// - 2º paso) crear un metodo de pago (tarjeta de credito) y asociarlo al cliente del 1º paso
// - 3 paso) crear un cargo asociado al cliente CUSTOMER y al metodo de pago CARD del 1º y 2º paso
//!!!! IMPORTANTE !!!! en el body de las peiticiones HTTP que se hagan a este servicio stripeService.js
// no se pueden mandar datos en formato JSON, sino que se tienen que mandar en formato x-www-form-urlencoded
// variable=valor&variable=valor&....
// hay q mandar cabecera de Authorization con Bearer + API KEY de Stripe
// Authorization: Bearer ......

const BASE_URL_STRIPE="https://api.stripe.com/v1";

module.exports = {
    Stage1_CreateCustomer: async (nombre, apellidos, email, datosEnvio)=>{
        try {
            //1º PASO: crear el objeto CUSTOMER en Stripe: https://docs.stripe.com/api/customers/create?lang=curl
            const datosCliente={
                name: `${nombre} ${apellidos}`,
                email,
                'address[line1]': datosEnvio.calle,
                'address[city]': datosEnvio.municipio.DMUN50,
                'address[state]': datosEnvio.provincia.PRO,
                'address[postal_code]': datosEnvio.cp,
                'address[country]': datosEnvio.pais
            }
            
            const petCrearCustomer=await fetch(`${BASE_URL_STRIPE}/customers`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.STRIPE_API_KEY}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(datosCliente) //name=nombre+apellidos&email=email&...<---- aqui van los datos del cliente en formato x-www-form-urlencoded
            });
            //segun stripe la peticion ha ido ok si el codigo de respuesta HTTP es 2xx, 
            // si es 4xx ha habido fallos en parametros 
            // si es 5xx ha habido fallos en el servidor de stripe
            if(petCrearCustomer.status<200 || petCrearCustomer.status>=299) throw new Error(`Error en creacion de CUSTOMER en Stripe. Codigo HTTP: ${petCrearCustomer.status}`);
            
            const datosCustomerStripe=await petCrearCustomer.json();
            console.log("Datos del CUSTOMER creado en Stripe: ", datosCustomerStripe);
            
            return datosCustomerStripe.id; //devolvemos el id del cliente CUSTOMER creado en Stripe


        } catch (error) {
            console.log("ERROR en stripeService Stage1_CreateCustomer: ", error);
            return null;
        }
    },
    Stage2_CreateCardForCustomer: async (idCustomer, datosTarjeta)=>{
        try {
            //2º PASO: crear el metodo de pago (tarjeta de credito) y asociarlo al cliente CUSTOMER
            //https://docs.stripe.com/api/cards/create?lang=curl
            const datosTarjetaStripe={
                'source':'visa' //<----- para pruebas en modo desarrollo, se puede usar 'visa', 'mastercard', 'amex', etc
                //en real (produccion) los datos de la tarjeta se pasan a stripe asi:
                // 'source[number]': datosTarjeta.numero,
                // 'source[exp_month]': datosTarjeta.mesExpiracion,
                // 'source[exp_year]': datosTarjeta.anioExpiracion,
                // 'source[cvc]': datosTarjeta.cvc
            }

            const petCreateCard=await fetch(`${BASE_URL_STRIPE}/customers/${idCustomer}/sources`, 
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.STRIPE_API_KEY}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(datosTarjetaStripe) //number=4242424242424242&exp_month=12&exp_year=2025&cvc=123                  
                    
                }
            );
            if(petCreateCard.status<200 || petCreateCard.status>=299) throw new Error(`Error en creacion de CARD en Stripe. Codigo HTTP: ${petCreateCard.status}`);

            const datosCardStripe=await petCreateCard.json();
            console.log("Datos de la CARD creada en Stripe: ", datosCardStripe);

            return datosCardStripe.id; //devolvemos el id de la tarjeta CARD creada en Stripe


        } catch (error) {
            console.log("ERROR en stripeService Stage2_CreateCardForCustomer: ", error);
            return null;
        }
    },
    Stage3_CreateChargeForCustomer: async (idCustomer, idCard, importe, idPedido)=>{
        try {
            //3º PASO: crear un cargo (charge) asociado al cliente CUSTOMER y a la tarjeta CARD 
            //https://docs.stripe.com/api/charges/create?lang=curl <=== DEPRECATED!!!! usar Payment Intents 
            //https://docs.stripe.com/api/payment_intents/create?lang=curl
            const bodyPaymentIntent={
                'customer': idCustomer,
                'payment_method': idCard,
                'amount': importe * 100, //importe en centimos de euro
                'currency': 'eur',
                'description': `Pago pedido tiendaHSN-B. ID Pedido: ${idPedido}`,
                'confirm': 'true', //<---------------------------  no pide confirmacion al crear el payment intent, lo confirma directamente
                'automatic_payment_methods[enabled]': true, //<--- habilitas para el pago en stripe metodos descritos en tu dashboard
                'automatic_payment_methods[allow_redirects]': 'never' //<-- para evitar redirecciones en el flujo de pago al cliente para pedir confirmacion
            }

            const petPaymentIntent=await fetch(`${BASE_URL_STRIPE}/payment_intents`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.STRIPE_API_KEY}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(bodyPaymentIntent)
                });
            if(petPaymentIntent.status<200 || petPaymentIntent.status>=299) throw new Error(`Error en creacion de PAYMENT INTENT en Stripe. Codigo HTTP: ${petPaymentIntent.status}`);

            const datosPaymentIntent=await petPaymentIntent.json();
            console.log("Datos del PAYMENT INTENT creado en Stripe: ", datosPaymentIntent);

            return datosPaymentIntent.id; //devolvemos el id del PAYMENT INTENT creado en Stripe

        } catch (error) {
            console.log("ERROR en stripeService Stage3_CreateChargeForCustomer: ", error);
            return null;
        }
    }
}