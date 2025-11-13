import './MisDatos.css';
import  { useRef, useState } from 'react';
import useGlobalState from '../../../../globalState/stateGlobal';
function MisDatos() {

    const { cliente } = useGlobalState();

    const selectorImagen=useRef(null);
    const botonGuardarRef=useRef(null);

    const [form, setForm] = useState({
        tipoCuenta: 'particular', // 'particular' | 'empresa'
        nombre: cliente.nombre || '',
        apellidos: cliente.apellidos || '',
        email: cliente.cuenta.email || '',
        telefonoContacto: cliente.cuenta.telefonoContacto || '',
        fechaNacimiento: cliente.fechaNacimiento || '',
        genero: cliente.genero || '',
        nifcif: '', // DNI or CIF depending on tipoCuenta
        nombreEmpresa: '',
        avatarUsuario: cliente.cuenta.imagenAvatar || '', //<----- variable del state solo usada para previsualizar la imagen seleccionada, no lo mando al servidor
        fichImagenUsuario: null
    });

    const [errors, setErrors] = useState({});
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
        setSaved(false);
    };

    const validate = () => {
        const err = {};
            // Validaciones según tipo de cliente
            if (form.tipoCuenta === 'particular') {
                if (!form.nombre.trim()) err.nombre = 'Introduce tu nombre';
                if (!form.apellidos.trim()) err.apellidos = 'Introduce tus apellidos';
            } else {
                if (!form.nombreEmpresa.trim()) err.nombreEmpresa = 'Introduce el nombre de la empresa';
            }

           // if (!form.email.trim()) err.email = 'Introduce tu email';
        //else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Email inválido';
            if (!form.nifcif.trim()) err.nifcif = form.clientType === 'empresa' ? 'Introduce el CIF' : 'Introduce el DNI';
        return err;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        console.log(`Errores de validacion: ${JSON.stringify(err)}`);

        if (Object.keys(err).length) {
            setErrors(err);
            setSaved(false);
            return;
        }

        // Aquí iría la llamada al API para guardar los datos del cliente.
        // De momento simulamos éxito y mostramos un mensaje.
        console.log('Guardando datos personales:', form);
        
        //tengo q mandar datos al server en formato "multipart/form-data" pq puede incluir fichero imagen junmto con otro tipo de datos
        const formDataToSend = new FormData();
        // Añade todas las propiedades del state 'form' excepto la vista previa y el file, y añade el fichero si existe
        Object.entries(form).forEach(([key, value]) => {
            //if (key === 'avatarUsuario' || key === 'fichImagenUsuario') return;
            if (value === undefined || value === null) return;
            if (typeof value === 'string' && value.trim() === '') return;
            formDataToSend.append(key, value);
        });

        const petActDatosCli = await fetch('http://localhost:3000/api/Cliente/ActualizarDatosPersonales', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, //<----- en teoria habria q mandar el JWT de autorizacion
                //'X-REFRESH-TOKEN': 'mi-REFRESH-TOKEN-si-lo-tuviera', //<----- en teoria habria q mandar el REFRESH TOKEN si lo tuviera
                //'Content-Type': 'multipart/form-data', // No establecer el Content-Type al usar FormData; el navegador lo hará automáticamente, incluyendo los límites necesarios.                
            },
            body: formDataToSend
        });
        const respuesta=await petActDatosCli.json();
        if( respuesta.codigo !==0 ) throw new Error(`Error al actualizar los datos del cliente: ${respuesta.mensaje}`);
        
        console.log('Datos personales actualizados correctamente');
        alert('Datos personales actualizados correctamente');
        setSaved(true);
    };


    const InputImagenOnChange = (ev) => {
            //en ev.target.files <--- FileList o array de objetos de tipo FILE seleccionados, en pos. [0] estaria el fich.imagen a leer
            let _imagen=ev.target.files[0];
            setForm((prev) => ({ ...prev, fichImagenUsuario: _imagen }));

            let _lector=new FileReader();

            _lector.addEventListener('load',(evt)=>{
                let _contenidoFichSerializado=evt.target.result; //contenido del fichero leido y serializado en base64 DataURL
                setForm((prev) => ({ ...prev, avatarUsuario: _contenidoFichSerializado }));
            });
            _lector.readAsDataURL(_imagen);
        }


    return (
        <div className="container">
            <div className='row m-4'>
                <div className='col-12'>
                    <h5>Mis Datos Personales</h5>
                    <hr></hr>
                    <p>Aquí puedes ver y editar los datos de tu cuenta.</p>
                </div>
            </div>

            <div className='row m-4'>
                <div className='col-12'>
                    <form className="mis-datos-form" onSubmit={handleSubmit} noValidate>

                        {/* Tipo de cliente: Particular / Empresa */}
                        <div className="mb-3">
                            <label className="form-label me-3">Tipo de cliente</label>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label" 
                                        htmlFor="clientParticular"
                                        style={{ color: form.tipoCuenta === 'particular' ? '#00b22d' : '#ccc' }}>
                                    Soy Particular
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="clientParticular"
                                        name="tipoCuenta"
                                        value="particular"
                                        checked={form.tipoCuenta === 'particular'}
                                        onChange={handleChange}
                                    />
                                    <span className='checkmark'></span>

                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label" 
                                        htmlFor="clientEmpresa" 
                                        style={{ color: form.tipoCuenta === 'empresa' ? '#00b22d' : '#ccc' }}>
                                    Soy Empresa
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="clientEmpresa"
                                        name="tipoCuenta"
                                        value="empresa"
                                        checked={form.tipoCuenta === 'empresa'}
                                        onChange={handleChange}
                                    />
                                    <span className='checkmark'></span>                                    
                                </label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label" htmlFor="nombre">Nombre</label>
                                <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} type="text" className="form-control" placeholder="Nombre" />
                                {errors.nombre && <div className="invalid-feedback d-block">{errors.nombre}</div>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label" htmlFor="apellidos">Apellidos</label>
                                <input id="apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} type="text" className="form-control" placeholder="Apellidos" />
                                {errors.apellidos  && <div className="invalid-feedback d-block">{errors.apellidos}</div>}
                            </div>
                        </div>



                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label" htmlFor="telefonoContacto">Teléfono</label>
                                <input id="telefonoContacto" name="telefonoContacto" value={form.telefonoContacto} onChange={handleChange} type="tel" className="form-control" placeholder="+34 600 000 000" />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label" htmlFor="nifcif">{form.tipoCuenta === 'empresa' ? 'CIF' : 'DNI'}</label>
                                <input id="nifcif" name="nifcif" value={form.nifcif} onChange={handleChange} type="text" className="form-control" placeholder={form.tipoCuenta === 'empresa' ? 'CIF' : 'DNI'} />
                                {errors.nifcif && <div className="invalid-feedback d-block">{errors.nifcif}</div>}
                            </div>

                            {form.tipoCuenta === 'particular' && (
                                <>
                                    <div className="col-md-8 mb-3">
                                        <label className="form-label" htmlFor="fechaNacimiento">Genero</label>
                                        <select className="form-select" aria-label="Default select example" onChange={handleChange} name='genero'>
                                            <option value="male">Masculino</option>
                                            <option value="female">Femenino</option>
                                            <option value="other">Otro</option>
                                        </select>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label" htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                                        <input id="fechaNacimiento" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} type="date" className="form-control" />
                                    </div>
                                </>
                            )}
                            <div className="col-md-4">
                                <div className="text-muted">{form.tipoCuenta=='particular' ? 'Foto' : 'Logo empresa'}</div>
                                <div id="avatarPerfil" className="card" style={{width:"200px",height:"250px", backgroundColor:"aliceblue"}} onClick={ ()=> selectorImagen.current.click() }>
                                    <input type="file" accept="image/*" ref={selectorImagen}  style={{visibility:"hidden"}}  onChange={ InputImagenOnChange } />
                                    <img src={ form.avatarUsuario || "/images/imagen_usuario_sinavatar.jpg" } id="imagenUsuario"  style={{ objectFit:'cover'}} alt="..." />
                                </div>
                            </div>                            
                        </div>

                        {form.tipoCuenta === 'empresa' && (
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <label className="form-label" htmlFor="nombreEmpresa">Nombre de la empresa</label>
                                    <input id="nombreEmpresa" name="nombreEmpresa" value={form.nombreEmpresa} onChange={handleChange} type="text" className="form-control" placeholder="Razón social" />
                                    {errors.nombreEmpresa && <div className="invalid-feedback d-block">{errors.nombreEmpresa}</div>}
                                </div>
                            </div>
                        )}



                        <div className="d-flex flex-row justify-content-end ">
                            <button type="submit" ref={botonGuardarRef} className="btn btn-hsn-1 w-50"><i className="fa-solid fa-check"></i> Guardar Cambios</button>
                        </div>

                        {saved && <div className="text-danger">Datos guardados correctamente.</div>}
                    </form>
                </div>
            </div>

            <div className='row m-4'>
                <div className='col-12'>
                    <h5>Editar Email</h5>
                    <hr></hr>
                    <p>Recibiras un email en tu cuenta acutal para cambiar el cambio de direccion:</p>
                </div>                    
            </div>

            <div className="row m-4">
                <div className="col-8">
                    <input id="email" name="email" value={form.email} onChange={handleChange} type="email" className="form-control" placeholder="usuario@correo.com" />
                    {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                </div>
                <div className="col-4 d-flex flex-row justify-content-end ">
                    <button type="submit" className="btn btn-hsn-1"><i className="fa-solid fa-check"></i> Modificar Email</button>
                </div>                
            </div>

        </div>
    );
}

export default MisDatos;