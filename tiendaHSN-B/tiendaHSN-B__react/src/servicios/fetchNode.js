//modulo de codigo q exporta dos objetos js con metodos para hacer peticiones fetch a nuestro servidor nodejs
//uno para la zonaCliente y otro para la zonaTienda
const urlServidorNodejs='http://localhost:3000/api';

export const svcFetchCliente={
    Registro: async (datosRegistro)=>{
        try {
            //fetch a endpoing de nodejs para registro de cliente
            let respuesta=await fetch('http://localhost:3000/api/Cliente/Registro',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify(datosRegistro)
                });
            console.log(`respuesta del servidor al registro: ${JSON.stringify(respuesta)}`);

            let bodyRespuesta=await respuesta.json();
            return bodyRespuesta;
        } catch (error) {
            console.error(`Error en svcFetchCliente.Registro: ${error}`);
            throw error;
        }
    },
    Login: async (email, password)=>{
        try {
            //fetch a endpoing de nodejs para login de cliente
            let respuesta=await fetch('http://localhost:3000/api/Cliente/Login',{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({ email, password })
                }); 
            console.log(`respuesta del servidor al login: ${JSON.stringify(respuesta)}`);

            let bodyRespuesta=await respuesta.json();            
            return bodyRespuesta;
        } catch (error) {
            console.error(`Error en svcFetchCliente.Login: ${error}`);
            throw error;
        }
    },

}

export const svcFetchTienda={

}

//export default { svcFetchCliente, svcFetchTienda };