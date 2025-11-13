//modulo de codigo q exporta un objeto js con metodos para crear y verificar JWTs
const jwt = require('jsonwebtoken');
module.exports = {
    //metodo para crear un JWT
    crearToken: (payload, opcionesToken = {}) => {
        //payload: objeto js con los datos q quiero guardar en el token
        //opcionesToken: objeto js con opciones del token (caducidad, algoritmo cifrado...)
        const token = jwt.sign(payload, // <--- 1º parametro payload
            process.env.JWT_SECRET, // <--- 2º parametro clave secreta para cifrar y firmar el token
            opcionesToken // <--- 3º parametro opciones del token (caducidad, algoritmo cifrado...)
        );
        return token;
    },
    //metodo para verificar un JWT
    verificarToken: (tokenAcceso) => {
        //tokenAcceso: JWT a verificar
        try {
            const payload = jwt.verify(tokenAcceso, process.env.JWT_SECRET); 
           
            return payload;
        } catch (error) {
            
            console.error('Error al verificar el token JWT:', error);
            return null;
        }
    },
    extraerTokenCabecera: (cabeceras) => {
        
        const valorTokenAcceso =
            cabeceras['authorization']?.split(' ')[1] || '';

        const valorTokenRefresh =
            cabeceras['x-refresh-token'] || '';
        
            console.log("Estoy en jwt", valorTokenAcceso, valorTokenRefresh);
        return { valorTokenAcceso, valorTokenRefresh };
    }

}