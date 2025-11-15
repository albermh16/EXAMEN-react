//modulo de codigo paara configurar la PIPELINE del servidor web express
//va a exportar una funcion que recibe como parametro el objeto servidor web express desde el modulo server.js
//y dentro de la funcion se configuran los middlewares y demas elementos de la pipeline del servidor web express
const cookieParser = require('cookie-parser'); // <---- importamos la funcion que exporta el modulo cookie-parser que genera funcion middlewarepara procesar cookies
const express=require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const cors=require('cors');

module.exports=(serverExpress)=>{
    //#region ....como funciona la pipeline de express .... 
    //configuramos la pipeline del servidor web express, cada modulo middleware se encarga de una tarea concreta
    //son una funcion javascript q recibe 3 parametros:
    //1. request: objeto que representa la peticion http q hace el cliente al servidor si es el primero en la pipeline
    //              si no representa el objeto request modificado por el middleware anterior
    //2. response: objeto q representa la respuesta http q el servidor web express va a enviar al cliente
    //3. next: funcion q se debe invocar para pasar el control al siguiente middleware en la pipeline
    /*
        cliente react --------- HTTP_REQUEST ------------------------------> servidor web express
                                                                    pipenline de express
                                         |  middleware 1 (tarea concreta)   |  middleware 2 (tarea concreta) ... | middleware n (tarea concreta) | ----> next() ----> HTTP_RESPONSE
                                              function(req,res,next)    --NEXT-->   function(req,res,next)  --NEXT-->   function(req,res,next)
                           <------------------------|                         <------------------------|              <------------------------|
                             HTTP_RESPONSE
    */
     // para añadir un middleware a la pipeline del servidor express se usa el metodo .use([/ruta,] funcion_middleware) del objeto servidor express
     //#endregion  
     
    //#region---funciones middleware para todas las rutas o endpoints del servidor, las globales q siempre actuan ----- 
     //1.procesamiento de cookies, extraer de cabecera http_Request la cabecerea Cookie y meterla en objeto req.cookies
     serverExpress.use( cookieParser() ); // <---- ejecutamos la funcion cookieParser para obtener la funcion middleware y la pasamos al metodo .use() del servidor express
     
     //2. procesamiento de datos json en el body de la peticion http_request y lo mete en prop.body del objeto request: req.body
     //console.log(`el valor de la funcion express.json es: ${express.json}`); 
     serverExpress.use( express.json() ); // <---- ejecutamos la funcion express.json() para obtener la funcion middleware y la pasamos al metodo .use() del servidor express
    
    //3.procesamiento de datos en la url pasados por GET en la peticion http_request y los mete en prop.query del objeto request: req.query
    serverExpress.use( express.urlencoded( { extended: false } ) ); 

    //4. procesamiento de peticiones desde todos los origenes (dominios) CORS
    //console.log(`el valor de la funcion cors es: ${cors}`);
    serverExpress.use( cors() );

    //#endregion

    //#region---funciones middleware especificas para procesar determinadas rutas (PROCESADO DE ENRUTAMIENTO O ROUTING) ----- 

    serverExpress.use('/api/Cliente', require('./config_enrutamiento/endpointsCliente') ); // <---- importamos el objeto Router q exporta el modulo endpointsCliente.js y lo pasamos al metodo .use() del servidor express
    serverExpress.use('/api/Tienda', require('./config_enrutamiento/endpointsTienda') ); // <---- importamos el objeto Router q exporta el modulo endpointsCliente.js y lo pasamos al metodo .use() del servidor express
    serverExpress.use('/api/geo', require('../servicios/geo_api') ); // <---- importamos el objeto Router q exporta el modulo geo_api.js y lo pasamos al metodo .use() del servidor express
    //#endregion
    }