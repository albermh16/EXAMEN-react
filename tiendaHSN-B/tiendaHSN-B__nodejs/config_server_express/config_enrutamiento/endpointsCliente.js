//modulo de codigo q exporta un objeto Router o de enrutamiento de express
//para gestionar las peticiones http_request q empeiecen por /api/Cliente
const express = require('express');
const objetoRouter = express.Router(); // <---- obtenemos el objeto Router de express para configurar rutas y exportarlo

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const jwtService = require('../../servicios/jwtService.js');

//----------------- configuracion multer para gestion de ficheros en peticiones multipart/form-data --------
const multer = require('multer');
const storage = multer.memoryStorage(); // <---- almacenamos los ficheros en memoria RAM del servidor
const multerMiddleware = multer(
  {
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // Limite de 5MB
    }
  }
);

//----------------------------------------------------------------------------------------------------------


//defeinimos las rutas o endpoints del objeto Router
objetoRouter.post('/Registro', async (req, res, next) => {
  try {
    console.log(`datos mandados en el body por cliente REACT desde el componente Registro: ${JSON.stringify(req.body)}`);
    //-----1º insertar los datos en bd: HSN coleccion clientes (hacer validaciones antes de meter datos!!!!)
    await mongoose.connect(process.env.URL_MONGODB);

    //lanzo INSERT usando mongoose como si fuera una query normal ejecutada contra mongodb en la shell...sin usar ESQUEMAS-MODELO
    let resInsert = await mongoose.connection
      .collection('clientes')
      .insertOne(
        {
          nombre: req.body.nombre,
          apellidos: req.body.apellidos,
          genero: req.body.genero,
          cuenta: {
            tipoCuenta: req.body.tipoCuenta || 'particular',
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),  //<---- almacenamos HASH!!!!
            cuentaActivada: false,
            iamgenAvatar: '',
            fechaCreacionCuenta: Date.now(), //<---- OJO!!! campo fecha siempre en NUMERO MS, nunca string!!!!
            telefonoContacto: ''
          },
          direcciones: [],
          pedidos: [],
          listaFavoritos: [],
          pedidoActual: {},
          metodosPago: []

        }
      );
    console.log(`la operacion de registro en teoria ha ido bien, y su resultado es: ${JSON.stringify(resInsert)}`);
    //----- 2º paso envio de email de confirmacion de registro con link para activar cuenta (mailjet)
    // para llamar a la api de mailjet necesitamos:
    // hacer una peticion http_POST usando FETCH al endpoint de mailjet: https://api.mailjet.com/v3.1/send
    // tengo que añadir como cabeceras de la peticion:
    // - la cabecera Authorization con autenticacion basica (Basic Auth) con mi public key y private key de mailjet
    //      Authorization: Basic ....... <---- base64(public_key:private_key)
    //      Content-Type: application/json
    // - en el body de la peticion un json con un formato determinado por la API de mailjet  
    /*
    /*
        {
              "Messages":[
                {
                  "From":[
                    {
                      "Email":"pilot@mailjet.com",
                      "Name":"Your Mailjet Pilot"
                    }
                  ],
                  "HTMLPart":"<h3>Dear passenger, welcome to Mailjet!</h3><br />May the delivery force be with you!",
                  "Subject":"Your email flight plan!",
                  "TextPart":"Dear passenger, welcome to Mailjet! May the delivery force be with you!",
                  "To":[
                    {
                      "Email":"passenger@mailjet.com",
                      "Name":"Passenger 1"
                    }
                  ]
                }
              ]
          }
    */

    const tokenActivacionCuenta = jwtService.crearToken(
      { email: req.body.email, idCliente: resInsert.insertedId },  //<--- 1º parametro payload
      { expiresIn: '10min' } // <--- 2º parametro opciones del token (caducidad, algoritmo cifrado...)
    );

    const bodyFetchMailjet = {
      "Messages": [
        {
          "From": [
            {
              "Email": "pamaruiz69@gmail.com",
              "Name": "amdinistrador portal tienda HSN"
            }
          ],
          "HTMLPart": `
                          <div style="text-align: center;">
                            <img src="https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/logoHSNReduced.svg" alt="logo tienda HSN" style="width: 150px; height: auto;"/>
                          </div>
                          <div>
                            <p><h3>Gracias por registrarte en nuestra tienda HSN</h3></p>
                            <p>Para finalizar el proceso de registro correctamente, debes ACTIVAR TU CUENTA. Para ello</p>
                            <p>tienes que hacer click en el siguiente enlace: <a href="http://localhost:3000/api/Cliente/ActivarCuenta?email=${req.body.email}&idCliente=${resInsert.insertedId}&token=${tokenActivacionCuenta}">PULSA AQUI</a></p>
                          </div>
                          `,
          "Subject": "Activacion de cuenta en portal tienda HSN",
          "TextPart": "",
          "To": [
            {
              "Email": req.body.email,
              "Name": `${req.body.nombre} ${req.body.apellidos}`
            }
          ]
        }
      ]
    }
      ;
    const petRespMailjet = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.MAILJET_PUBLIC_KEY + ':' + process.env.MAILJET_SECRET_KEY).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyFetchMailjet)
    });

    const datosRespMailjet = await petRespMailjet.json();
    console.log(`respuesta de Mailjet: ${JSON.stringify(datosRespMailjet)}`);
    //a mi solo me interesa de la respuesta la prop.Status de la primera posicion del array Messages 
    // (solo he mandado un email en esta peticion) y ver si es igual a 'success'
    if (datosRespMailjet.Messages[0].Status !== 'success') {
      //si lo dejas asi el problema es q ya he insertado el cliente en la bd, pero no ha ido bien el envio del email
      //y al cliente de REACT solo le llega q ha habido un error en el registro...y q lo intente de nuevo 
      //pero en la bd ya esta el email registrado ¿solucion?
      // 1º borrar el cliente insertado en la bd
      // 2º esperar de nuevo un cierto tiempo y volver a intentar el envio del email a los 5min
      //setTimeout( ()=>{ ...envio de email igual q arriba...}, 5*60*1000)
      throw new Error('error en envio de email de activacion de cuenta');
    }

    //----- 3º paso envio respuesta al cliente:
    res.status(200).send({ codigo: 0, mensaje: 'datos recibidos ok..' });

  } catch (error) {
    console.log(`error en registro de datos del cliente: ${error}`);
    res.status(200).send({ codigo: 1, mensaje: `error en registro de datos del cliente: ${error}` });


  }
}
)

objetoRouter.post('/Login', async (req, res, next) => {
  try {
    console.log(`datos mandados en el body por cliente REACT desde el componente Login: ${JSON.stringify(req.body)}`);
    //----- 1º paso comprobar si el email existe en la bd...lanzando query de mongo sin usar ESQUEMAS-MODELO
    await mongoose.connect(process.env.URL_MONGODB);
    let resFindEmailCliente = await mongoose.connection
      .collection('clientes')
      .findOne({ 'cuenta.email': req.body.email });

    if (!resFindEmailCliente) throw new Error('email no existe en bd');
    //----- 2º paso si existe el email, comprobar si el password es correcta (calcular el hash de la password que me pasan
    //y compararlo con el hash almacenado en la bd para ese email)
    if (!bcrypt.compareSync(req.body.password, resFindEmailCliente.cuenta.password)) throw new Error('password incorrecta');

    //----- 3º paso si todo ok comprobar si la cuenta esta activada, si no esta activada enviar email de activacion

    //----- 4º crear JWT DE SESION PARA EL CLIENTE 
    // const token=jwt.sing({ email: req.body.email, idCliente: resFindEmailCliente._id }, // <--- 1º parametro payload
    //                       process.env.FIRMA_JWT_SERVER, // <--- 2º parametro clave secreta para cifrar y firmar el token
    //                       { expiresIn: '2h' } // <--- 3º parametro opciones del token (caducidad, algoritmo cifrado...)
    //                     );
    const token = jwtService.crearToken(
      { email: req.body.email, idCliente: resFindEmailCliente._id }, // <--- 1º parametro payload
      { expiresIn: '2h' } // <--- 2º parametro opciones del token (caducidad, algoritmo cifrado...)
    );
    const refreshToken = jwtService.crearToken(
      { email: req.body.email, idCliente: resFindEmailCliente._id }, // <--- 1º parametro payload
      { expiresIn: '7d' } // <--- 2º parametro opciones del token (caducidad, algoritmo cifrado...)
    );
    //----- 5º paso envio respuesta al cliente de q todo ok con SUS DATOS COMPLETOS (pedidos, direcciones, etc)
    res.status(200).send(
      {
        codigo: 0,
        mensaje: 'Login ok',
        datosCliente: resFindEmailCliente,
        accessToken: token,
        refreshToken: refreshToken
      }
    );
  } catch (error) {
    console.log(`error en login de datos del cliente: ${error}`);
    res.status(200).send({ codigo: 2, mensaje: `error en login: ${error}` });
  }
});

objetoRouter.get('/ActivarCuenta', async (req, res, next) => {
  try {
    //1º extraer de la url las variables: email, idCliente, token <---- estan en req.query
    console.log(`parametros pasados en la url de activacion de cuenta: ${JSON.stringify(req.query)}`);
    const { email, idCliente, token } = req.query;
    if (!email || !idCliente || !token) throw new Error('faltan parametros en la url de activacion de cuenta del cliente');

    //2º comprobar q el token es correcto(con la clave process.env.JWT_SECRET) y no ha caducado <---metodo jwt.verify()
    const payload_token = jwtService.verificarToken(token); // <--- si el token no es valido o ha caducado lanza excepcion
    if (!payload_token) throw new Error('token JWT no valido o ha caducado');
    console.log(`payload del token JWT recibido en la peticion de activacion de cuenta: ${JSON.stringify(payload_token)}`);

    //3º si todo ok comprobar q el campo email coincide con el campo email del payload del token (igual para el idCliente)
    if (email !== payload_token.email || idCliente !== payload_token.idCliente) throw new Error('los datos del token JWT no coinciden con los parametros de la url de activacion de cuenta del cliente');

    //4º si todo ok lanzar un update en la bd para poner cuentaActivada=true para ese cliente
    let resUpdate = await mongoose.connection
      .collection('clientes')
      .updateOne(
        { 'cuenta.email': email, _id: new mongoose.Types.ObjectId(idCliente) },
        { $set: { 'cuenta.cuentaActivada': true } }
      );

    res.status(200).redirect('http://localhost:5173/Cliente/ActivacionCuentaOK');

  } catch (error) {
    console.log(`error en activacion de cuenta del cliente: ${error}`);
    res.status(200).redirect('http://localhost:5173/Cliente/ActivacionCuentaERROR');
  }
});

objetoRouter.post('/ActualizarDatosPersonales',
  multerMiddleware.single('fichImagenUsuario'),
  async (req, res, next) => {
    try {
      //antes de operar compruebo el JWT de autorizacion mandado en la cabecera Authorization
      //const valorTokenEnCabecera=req.headers['Authorization']?.split(' ')[1];

      //verificamos el token, tanto en su validez como en su caducidad
      //si no es valido o ha caducado lanza excepcion
      //en el payload del token tengo el email e idCliente del cliente
      //const payload_token=jwt.verify( valorTokenEnCabecera, process.env.FIRMA_JWT_SERVER ); // <--- si el token no es valido o ha caducado lanza excepcion

      const { valorTokenAcceso, valorTokenRefresh } = jwtService.extraerTokenCabecera(req.headers);
      const payload_token = jwtService.verificarToken(valorTokenAcceso);
      if (!payload_token) throw new Error('token JWT no valido o ha caducado');

      //datos multipart/form-data recibidos del formulario del componente REACT MisDatos.jsx:
      //campos normales en req.body y fichero en req.file
      const { tipoCuenta,
        nombre,
        apellidos,
        email,
        telefonoContacto,
        fechaNacimiento,
        genero,
        nifcif,
        nombreEmpresa } = req.body;
      const { fichImagenUsuario } = req.file;

      console.log(`peticion HTTP POST recibida desde cliente REACT, con datos en el cuerpo: ${JSON.stringify(req.body)}`);
      console.log(`fichero recibido en la peticion HTTP POST desde cliente REACT: ${JSON.stringify(req.file)}`);
      //validar y procesar los datos recibidos...
    } catch (error) {

    }
  });

objetoRouter.get('/Direcciones', async (req, res, next) => {
  try {
    //antes de operar compruebo el JWT de autorizacion mandado en la cabecera Authorization
    const { valorTokenAcceso, valorTokenRefresh } = jwtService.extraerTokenCabecera(req.headers);
    
    let payload_token = jwtService.verificarToken(valorTokenAcceso);

    if (!payload_token && valorTokenRefresh) {
      // Si el access token ha caducado, intentar usar el refresh token
      const payload_refresh = jwtService.verificarToken(valorTokenRefresh);
      if (!payload_refresh) throw new Error('tokens JWT no validos o han caducado');

      // Crear nuevo access token
      const nuevoAccess = jwtService.crearToken(
        { idCliente: payload_refresh.idCliente, email: payload_refresh.email },
        { expiresIn: '2h' }
      );

      res.setHeader('X-NEW-ACCESS-TOKEN', nuevoAccess);
      payload_token = payload_refresh;
    } else if (!payload_token) {
      throw new Error('token JWT no valido o ha caducado');
    }

    //si todo ok lanzo query para obtener las direcciones del cliente
    let resFindDirecciones = await mongoose.connection
      .collection('clientes')
      .findOne(
        { _id: new mongoose.Types.ObjectId(payload_token.idCliente) },
        { projection: { direcciones: 1, _id: 0 } }
      );

    console.log(`direcciones encontradas en bd para el cliente ${payload_token.idCliente}: ${JSON.stringify(resFindDirecciones)}`);

    res.status(200).json(
      {
        codigo: 0,
        mensaje: 'direcciones obtenidas ok',
        direcciones: resFindDirecciones.direcciones
      }
    );

  } catch (error) {
    console.log(`error en obtencion de direcciones del cliente: ${error}`);
    res.status(200).send({ codigo: 3, mensaje: `error en obtencion de direcciones del cliente: ${error}` });
  }
});

objetoRouter.post('/Direccion', async (req, res, next) => {
  try {
    console.log(req.headers)
    //antes de operar compruebo el JWT de autorizacion mandado en la cabecera Authorization
    const { valorTokenAcceso, valorTokenRefresh } = jwtService.extraerTokenCabecera(req.headers);
    let payload_token = jwtService.verificarToken(valorTokenAcceso);

    if (!payload_token) {
      // Si el access token ha caducado, intentar usar el refresh token
      const payload_refresh = jwtService.verificarToken(valorTokenRefresh);

      console.log("estoy en cliente ", payload_refresh, payload_token);
      if (!payload_refresh) {
        throw new Error('tokens JWT no validos o han caducado');
      }

      // Crear nuevo access token
      const nuevoAccess = jwtService.crearToken(
        { idCliente: payload_refresh.idCliente, email: payload_refresh.email },
        { expiresIn: '2h' }
      );

      res.setHeader('X-NEW-ACCESS-TOKEN', nuevoAccess);

      payload_token = payload_refresh;
    } else if (!payload_token) {
      throw new Error('token JWT no valido o ha caducado');
    }


    //datos recibidos en el body:

    const { operacion, direccion, idDireccion } = req.body;

    if (operacion === 'ADD' && !direccion) {
      return res.status(200).json({ codigo: 2, mensaje: 'direccion requerida en ADD' });
    }
    if ((operacion === 'UPDATE' || operacion === 'DELETE' || operacion === 'SET_DEFAULT' || operacion === 'SET_FACTURACION')
      && !idDireccion) {
      return res.status(200).json({ codigo: 2, mensaje: 'idDireccion requerido' });
    }

    if (!operacion) {
      throw new Error('falta el parametro operacion en el body de la peticion');
    }

    const idCliente = new mongoose.Types.ObjectId(payload_token.idCliente);
    const coleccionClientes = mongoose.connection.collection('clientes');

    const unsetPrincipal = async () =>
      coleccionClientes.updateOne({ _id: idCliente }, { $set: { 'direcciones.$[].esPrincipal': false } });
    const unsetFacturacion = async () =>
      coleccionClientes.updateOne({ _id: idCliente }, { $set: { 'direcciones.$[].esFacturacion': false } });

    switch (operacion) {
      case 'ADD': {
        //añadir la nueva direccion al array direcciones del cliente

        if (direccion.esPrincipal === true) await unsetPrincipal();
        if (direccion.esFacturacion === true) await unsetFacturacion();

        const subIdDireccion = new mongoose.Types.ObjectId();
        const nuevaDireccion = { ...direccion, _id: subIdDireccion };

        await coleccionClientes.updateOne(
          { _id: idCliente },
          { $push: { direcciones: nuevaDireccion } }
        );
        break;
      }

      case 'UPDATE': {
        //modificar la direccion del array direcciones del cliente
        if (direccion.esPrincipal === true) await unsetPrincipal();
        if (direccion.esFacturacion === true) await unsetFacturacion();

        const idDir = new mongoose.Types.ObjectId(idDireccion);

        const reemplazo = { ...direccion, _id: idDir };
        await coleccionClientes.updateOne(
          { _id: idCliente, 'direcciones._id': idDir },
          { $set: { 'direcciones.$': reemplazo } }
        );
        break;
      }

      case 'DELETE': {
        //eliminar la direccion del array direcciones del cliente

        const idDir = new mongoose.Types.ObjectId(idDireccion);
        await coleccionClientes.updateOne(
          { _id: idCliente },
          { $pull: { direcciones: { _id: idDir } } }
        );
        break;
      }
      case 'SET_DEFAULT': {
        //establecer la direccion como predeterminada de envio o facturacion

        const idDir = new mongoose.Types.ObjectId(idDireccion);
        await unsetPrincipal();
        await coleccionClientes.updateOne(
          { _id: idCliente },
          { $set: { 'direcciones.$[elem].esPrincipal': true } },
          { arrayFilters: [{ "elem._id": idDir }] }
        );
        break;
      }

      case 'SET_FACTURACION': {
        //establecer la direccion de facturacion del pedido actual
        const idDir = new mongoose.Types.ObjectId(idDireccion);
        await unsetFacturacion();

        await coleccionClientes.updateOne(
          { _id: idCliente },
          { $set: { 'direcciones.$[elem].esFacturacion': true } },
          { arrayFilters: [{ "elem._id": idDir }] }
        );
        break;
      }

      default:
        return res.status(200).send(
          {
            codigo: 4,
            mensaje: `operacion no valida en gestion de direcciones del cliente: ${operacion}`
          }
        );
    }

    

    res.status(200).send(
      {
        codigo: 0,
        mensaje: `operacion ${operacion} en direcciones del cliente realizada ok`
      }
    );


  } catch (error) {
    console.log(`error en operacion de gestion de direcciones del cliente: ${error}`);
    res.status(200).send({ codigo: 5, mensaje: `error en operacion de gestion de direcciones del cliente: ${error}` });
  }
});




module.exports = objetoRouter; // <---- exportamos el objeto Router para usarlo en el modulo server.js