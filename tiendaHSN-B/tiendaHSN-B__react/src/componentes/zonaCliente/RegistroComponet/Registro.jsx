import InputBox from '../../compGlobales/InputBoxComponent/InputBox';
import './Registro.css'
import {useState} from 'react'
import {svcFetchCliente} from '../../../servicios/fetchNode.js';
import { useNavigate } from 'react-router-dom';


function Registro() {
  // ------------- variables de estado del componente -------------
  //#region state usando variables sueltas por cada campo del formulario
  // const [nombre, setNombre] = useState('introduce tu nombre');
  // const [apellidos, setApellidos] = useState('introduce tus apellidos');
  // const [email, setEmail] = useState('tu email');
  // const [password, setPassword] = useState('');
  // const [genero, setGenero] = useState('');
  //#endregion
  const [ formulario, setFormulario ]=useState( {  } );
  const navigate=useNavigate();
  // ------------ funciones manejadoras de eventos------------
  // function handleBlurNombre(ev) {
  //   console.log(`el evento onblur se ha disparado y su objeto valoe....${ev.target.value}`);
  //   setNombre(  ev.target.value); //<---- actualizo la variable de estado (en teoria)
  //   console.log(`ahora la vaiable de estado nombre vale: ${nombre}`); 
  // }
  async function handlerSubmitButton(ev) {
    try {
          //submit campos del formulario a url externa 
          ev.preventDefault(); //<----- evita el comportamiento por defecto del evento submit del formulario: mandar datos a url externa y refrescar
          //console.log(`variables del state del componente -> ${nombre},${apellidos},${email},${password},${genero}`);
              console.log(`variables del state del componente -> ${JSON.stringify(formulario)}`);

          //mando datos al servidor de nodejs al servicio API-REST
          //#region ----- usando .then() y .catch() -----
          // fetch('http://localhost:3000/api/registro',
          //       {   
          //           method:'POST',
          //           headers:{
          //             'Content-Type':'application/json'
          //           },
          //           body: JSON.stringify( { nombre, apellidos, email, password, genero } ) //<---serializamos el objeto literal a texto para incluirlo en la peticion
          //         }
          //       ).then( respuesta => console.log(`respuesta del servidor: ${respuesta}`) )
          //        .catch( error => console.log(`error en la peticion: ${error}`) );
          //#endregion
          //#region----- usando async await -----    
          // const respuetaServer=await fetch('http://localhost:3000/api/Cliente/Registro', //<---el await recupera la respuesta del servidor CORRECTA!!! como el .then()
          //       {   
          //           method:'POST',
          //           headers:{
          //             'Content-Type':'application/json'
          //           },
          //           body: JSON.stringify(formulario)//JSON.stringify( { nombre, apellidos, email, password, genero } ) //<---serializamos el objeto literal a texto para incluirlo en la peticion
          //         }
          //       );
          //       console.log(`respuesta del servidor: ${respuetaServer}`);
          //#endregion
          const respuestaServer=await svcFetchCliente.Registro( formulario ); //<---llamada al servicio de fetch cliente para registro
          console.log(`respuesta del servidor: ${JSON.stringify(respuestaServer)}`);
          if (respuestaServer.codigo!==0) throw new Error(`No se ha podido registrar el usuario, error: ${respuestaServer.mensaje}`);
          //redirigir a componente de registrook para q muestre q se le ha enviado un email de confirmacion de cuenta, yo dirijo a pagina de inicio por simplicidad
          navigate('/');

    } catch (error) {
        console.error(`Error en handlerSubmitButton: ${error}`);
    }

  }


  function OnChangeHandler(ev){
    console.log(`el evento onChange se ha disparado y su objeto valoe....${ev.target.value} en caja de texto ${ev.target.name}`);
    //actualizo la variable de estado partiendo del valor anterior y actualizando solo la propiedad que ha cambiado (indicado en atributo "name")
    setFormulario( valorAnterior => { return { ...valorAnterior, [ev.target.name]: ev.target.value} }   );
    
  }

  return (
    <div className="container-fluid m-5">
      <div className="row">
        {/* Columna izquierda: introducción y redes sociales */}
        <div className="col-lg-5 mb-4 mb-lg-0 ">
          <h2 style={{ color: "#e1522e", fontWeight: "300" }} className="mb-3">
            Hola, ¿creamos tu cuenta?
          </h2>
          <p className="text-muted">
            Estás a punto de crear tu cuenta en HSNstore con lo que conseguirás
            acceder a promociones especiales, acumular puntos, y ahorrarte
            dinero...
          </p>
          <p>
            <a href="#" className="text-primary text-decoration-underline">
              Uy, si yo ya tengo una cuenta creada.
            </a>
          </p>
          {/* Lista de ventajas */}
          <div className="mb-3">
            {[
              "Accederás a promociones y descuentos antes que nadie.",
              "Acumularás puntos = dinero para futuras compras.",
              "Recibirás cupones, regalos sorpresa sólo para registrados.",
              "Podrás invitar a tus amigos y conseguir 5€ en futuras compras.",
              "Puedes cargar tus pedidos anteriores con un solo click.",
              "Y mucho más...",
            ].map((item, idx) => (
              <p key={idx} className="mb-2 d-flex align-items-start">
                <span
                  className="me-2"
                  style={{
                    color: "#e1522e",
                    fontSize: "1.1rem",
                    lineHeight: 1,
                  }}
                >
                  ✔
                </span>
                <span>{item}</span>
              </p>
            ))}
          </div>
          {/* Redes sociales */}
          <div className="p-3" style={{ backgroundColor: "#f5f5f5" }}>
            <h6 className="fw-bold text-uppercase mb-3">
              Crea o accede con tus redes sociales
            </h6>
            <div className='d-flex flex-row justify-content-center'>
              <button
                type="button"
                className="btn d-flex align-items-center border"
                style={{ backgroundColor: "#fff", borderColor: "#dadce0" }}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Continuar con Google"
                  width="20"
                  height="20"
                  className="me-2"
                />
                <span className="flex-grow-1 text-center">
                  Continuar con Google
                </span>
              </button>
              <button
                type="button"
                className="btn d-flex align-items-center border"
                style={{ backgroundColor: "#fff", borderColor: "#dadce0" }}
              >
                <img src="https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/logos/facebook-logo-5-1.png" alt="Continuar con Facebook" width="20" height="20" className="me-2"/>
                <span className="flex-grow-1 text-center">
                  Continuar con Facebook
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Columna derecha: formulario de registro */}
        <div className="col-lg-7 ">
          <div className="border p-4">
            <h2 className="h5 fw-bold mb-3">Datos de identificación de cuenta</h2>
            {/* Selector de tipo de cuenta */}
            <div className="mb-2"  aria-label="Tipo de cuenta">
              <button
                type="button"
                className="btn mx-3"
                style={{
                  borderColor: "#e1522e",
                  color: "#e1522e",
                  fontWeight: 600,
                }}
                onClick={ev => setFormulario({...formulario, tipoCuenta:'particular'})}
              >
                Particular
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  borderColor: "#b0b0b0",
                  color: "#b0b0b0",
                  fontWeight: 600,
                }}
                onClick={ev => setFormulario({...formulario, tipoCuenta:'empresa'})}
                disabled
              >
                Empresa
              </button>
            </div>
            <p className="small text-danger">
              * Atención: si eres autónomo o empresa y necesitas una factura
              selecciona la opción EMPRESA.
            </p>

            {/* =================== Formulario ========================== */}
            <form className="needs-validation" noValidate onSubmit={ handlerSubmitButton }>

             {
                  [ 'nombre', 'apellidos', 'email', 'password', 'planAmigo' ].map( ( campo, pos  ) =>
                    <InputBox  key={pos} 
                               nameInput={campo} 
                               labelInput={ campo==='planAmigo' ? 'Código Plan Amigo' : campo.charAt(0).toUpperCase() + campo.slice(1) } 
                               tipoInput={ campo==='email' ? 'email' : ( campo==='password' ? 'password' : 'text' ) } 
                               eventoOnChange={ OnChangeHandler } />
                  )

              }

              <div className="mb-3">
                <label htmlFor="genero" className="form-label fw-bold">
                  Género <span className="text-danger">*</span>
                </label>
                <select
                  id="genero"
                  className="form-select"
                  name="genero"
                  defaultValue={formulario.genero || "" }
                  onChange={ OnChangeHandler }
                  required
                >
                  <option value="" disabled>
                    Selecciona un género
                  </option>
                  <option>Hombre</option>
                  <option>Mujer</option>
                  <option>No binario</option>
                  <option>Prefiero no decirlo</option>
                </select>
                <div className="invalid-feedback">
                  Selecciona una opción.
                </div>
              </div>

              {/* Promociones y privacidad */}
              <h6 className="fw-bold">Enviar promociones especiales para clientes</h6>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="promo"
                />
                <label className="form-check-label" htmlFor="promo">
                  Quiero recibir promociones exclusivas y contenidos personalizados
                </label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="privacidad"
                  required
                />
                <label className="form-check-label" htmlFor="privacidad">
                  He leído y acepto la{" "}
                  <a href="#" className="text-primary text-decoration-underline">
                    Política de privacidad
                  </a>
                </label>
                <div className="invalid-feedback">
                  Debes aceptar la política de privacidad.
                </div>
              </div>
              {
              /* Botón de envío 
              <button type="button" className="btn btn-success w-100" onClick={ handlerSubmitButton }>
                REGISTRARME YA
              </button>              
              */}
              <button type="submit" className="btn btn-success w-100">
                REGISTRARME YA
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro