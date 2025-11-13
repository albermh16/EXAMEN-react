require('dotenv').config(); //<----- 1º instruccion del modulo principal q lee fichero .env y crea
//variables de entorno con contenido sensible...


//modulo de codigo de entrada del proyecto nodejs, configuramos servidor web express
const configExpress = require('express'); //<---- en variable configExpress se almacena funcion de configuracion servidor web q se exporta en modulo express
const configPipeline = require('./config_server_express/config_pipeline'); // <---- importamos la funcion de configuracion de la pipeline del servidor web express

//console.log(`el valor de la variable configExpress es: ${configExpress}`); // <---- imprimimos en consola el valor de la variable configExpress
//como resultado de la ejecucion de la funcion obtenemos un objeto que representa el servidor web express
const serverExpress=configExpress(); // <---- ejecutamos la funcion de configuracion del servidor web express y almacenamos el resultado en variable serverExpress
configPipeline(serverExpress); 


//levantamos el servidor y hacemos que escuche en el puerto 3000
serverExpress.listen( 3000, (error)=>{
    if(error){
      console.log(`error al levantar el servidor express: ${error}`);
    } else {
        console.log(`....servidor express levantado y escuchando en el puerto 3000...`);
    }
});
