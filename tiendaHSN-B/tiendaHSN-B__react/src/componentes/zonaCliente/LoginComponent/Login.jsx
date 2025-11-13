import './Login.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalStore from '../../../globalState/stateGlobal';
import { svcFetchCliente } from '../../../servicios/fetchNode.js';

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [ formularioLogin, setFormularioLogin ] = useState({});
  const { setCliente, setAccessToken, setRefreshToken } = useGlobalStore();

  function OnChangeHandler(ev){
    //deberiamos validar los datos que recibimos de cada <input....
    setFormularioLogin(
          valorAnterior => ({ ...valorAnterior, [ev.target.name]: ev.target.value })
        )
    }

    async function HandlerSubmitForm(ev){
      try {
      ev.preventDefault();
      console.log(`datos del formulario de login: ${JSON.stringify(formularioLogin)}`);
      // let respuesta=await fetch('http://localhost:3000/api/Cliente/Login',{
      //     method:'POST',
      //     headers:{'Content-Type':'application/json'},
      //     body: JSON.stringify(formularioLogin)
      // }); 
      // console.log(`respuesta del servidor al login: ${JSON.stringify(respuesta)}`);

      // let bodyRespuesta=await respuesta.json();
      let bodyRespuesta=await svcFetchCliente.Login(formularioLogin.email, formularioLogin.password);
      console.log(`body de la respuesta del servidor al login: ${JSON.stringify(bodyRespuesta)}`);
      if (bodyRespuesta.codigo !==0) throw new Error(`No se ha podido iniciar sesión, error: ${bodyRespuesta.mensaje}`);
      //almacenar en el state global los datos del cliente y token de acceso y redirigir o al panel del usuario o a la pagina de inicio de la tienda..
      setCliente(bodyRespuesta.datosCliente);
      setAccessToken( bodyRespuesta.accessToken );
      setRefreshToken( bodyRespuesta.refreshToken );

      navigate('/');

      } catch (error) {
        console.error(`Error en el proceso de login: ${error.message}`);
      }
    }

  return (
    <div className="container my-5">
      <div className="border p-4">
        <div className="row">
          {/* Sección de acceso (izquierda) */}
          <div className="col-lg-6">
            <h1 style={{ color: "#e1522e" }} className="fw-bold mb-2">
              Acceso a mi cuenta HSN
            </h1>
            <p className="mb-4">
              Si ya eres usuario registrado, introduce tu email y la contraseña que
              utilizaste en el registro
            </p>
            <form className="needs-validation" noValidate onSubmit={ HandlerSubmitForm }>
              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="loginEmail"
                  name="email"
                  onChange={OnChangeHandler}
                  required
                />
                <div className="invalid-feedback">Introduce un email válido.</div>
              </div>
              <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label">
                  Introduce tu contraseña
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="loginPassword"
                    name="password"
                    onChange={OnChangeHandler}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text bg-white border-start-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="
http://www.w3.org/2000/svg
"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-eye-slash"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.359 11.238l2.122 2.122-1.414 1.414-2.122-2.122a8.455 8.455 0 01-5.945 2.112C4.998 14.764 2.63 13.633 1 12.143l1.5-1.5c1.236 1.059 2.851 1.821 4.5 2.021v.002c.376.055.764.085 1.156.085.393 0 .78-.03 1.156-.085v-.003a8.456 8.456 0 005.148-2.471zM3.738 4.523l-2.122-2.122 1.414-1.414 2.122 2.122A8.455 8.455 0 018.5 1.236 8.455 8.455 0 0114.357 3.8l-1.5 1.5a8.456 8.456 0 00-5.148-2.471L8.5 2.828a2.5 2.5 0 00-3.535 0L3.738 4.523zm8.354.976l1.5 1.5a8.455 8.455 0 01.006 4.638l-1.494-1.494a5.471 5.471 0 00-.013-1.65l-1.008-1.008a5.5 5.5 0 00-7.748-.87l-1.502-1.502a8.456 8.456 0 015.148-2.471z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="
http://www.w3.org/2000/svg
"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-eye"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM8 2a6 6 0 00-6 6c0 .582.085 1.145.242 1.682C2.32 9.29 2.59 9.32 2.885 9.32 4.7 9.32 6.36 10.98 6.36 12.8c0 .295-.03.566-.09.836A6 6 0 008 14a6 6 0 006-6 6 6 0 00-6-6z" />
                        <path d="M8 5.5c-1.738 0-3.144 1.406-3.144 3.144s1.406 3.144 3.144 3.144 3.144-1.406 3.144-3.144C11.144 6.906 9.738 5.5 8 5.5z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="invalid-feedback">
                  Introduce tu contraseña.
                </div>
              </div>
              {/* Botón de iniciar sesión */}
              <button
                type="submit"
                className="btn w-100"
                style={{
                  backgroundColor: "#fff",
                  borderColor: "#e1522e",
                  color: "#e1522e",
                  fontWeight: 600,
                }}
              >
                INICIAR SESIÓN
              </button>
              {/* Links debajo del botón */}
              <div className="mt-2 d-flex justify-content-between align-items-center">
                <a href="#" className="text-primary small">
                  ¿Olvidó su contraseña?
                </a>
                <span className="text-success small d-flex align-items-center">
                  {/* Icono de candado (simplificado) */}
                  <svg
                    xmlns="
http://www.w3.org/2000/svg
"
                    width="14"
                    height="14"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="me-1"
                  >
                    <path d="M8 1a3 3 0 00-3 3v2h6V4a3 3 0 00-3-3z" />
                    <path d="M3.5 8V7a1 1 0 011-1h7a1 1 0 011 1v1a1 1 0 011 1v5a1 1 0 01-1 1h-9a1 1 0 01-1-1V9a1 1 0 011-1z" />
                  </svg>
                  Conexión segura
                </span>
              </div>
            </form>
          </div>

          {/* Sección de alta y redes (derecha) */}
          <div className="col-lg-6 mt-4 mt-lg-0">
            <div className="p-4 bg-light h-100">
              <h5 className="fw-bold text-uppercase mb-1">
                ¿Todavía no tienes cuenta?
              </h5>
              <p className="mb-3">
                Acumula puntos, obtén descuentos exclusivos, recibe regalos sorpresa...
                todas estas ventajas y muchas más con la cuenta HSN
              </p>
              <button className="btn btn-success w-100 mb-4">
                CREAR UNA CUENTA
              </button>
              <h6 className="fw-bold text-uppercase mb-2">
                Crea o accede con tus redes sociales
              </h6>
              <button
                type="button"
                className="btn w-100 mb-2 d-flex align-items-center border"
                style={{ backgroundColor: "#fff", borderColor: "#dadce0" }}
              >
                <img
                  src="
https://developers.google.com/identity/images/g-logo.png
"
                  alt="Google"
                  width={20}
                  height={20}
                  className="me-2"
                />
                <span className="flex-grow-1 text-center">
                  Continuar con Google
                </span>
              </button>
              <button
                type="button"
                className="btn w-100 d-flex align-items-center border"
                style={{ backgroundColor: "#fff", borderColor: "#dadce0" }}
              >
                <svg
                  xmlns="
http://www.w3.org/2000/svg
"
                  width="20"
                  height="20"
                  fill="#1877F2"
                  className="me-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.73 2h-2.6C8.84 2 8.5 2.77 8.5 4v1H11l-.5 3H8.5v7H5.5V8H3.5V5h2v-.75C5.5 2.83 6.79 1 9.73 1H12v3z" />
                </svg>
                <span className="flex-grow-1 text-center">
                  Continuar con Facebook
                </span>
              </button>
            </div>
          </div>
        </div>
        {/* Nota legal inferior */}
        <p className="small text-muted mt-4">
          Si haces clic en Continuar con Facebook, Google o Amazon y no eres usuario
          de HSN, pasarás a estar registrado y aceptas los{" "}
          <a href="#" className="text-primary text-decoration-underline">
            Términos y Condiciones
          </a>{" "}
          y la{" "}
          <a href="#" className="text-primary text-decoration-underline">
            Política de Privacidad
          </a>{" "}
          de HSN.
        </p>
      </div>
    </div>
  );
}

export default Login 