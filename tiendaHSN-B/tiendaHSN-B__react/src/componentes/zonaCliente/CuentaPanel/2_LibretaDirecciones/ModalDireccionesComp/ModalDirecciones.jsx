import './ModalDirecciones.css';
import useGlobalState from '../../../../../globalState/stateGlobal';
import { useEffect, useState, useMemo} from 'react';

function ModalDirecciones({ onDireccionSaved, modo, direccion = null, onCloseEditar }) {

    const accessToken = useGlobalState(state => state.accessToken);
    const setAccessToken = useGlobalState(state => state.setAccessToken);
    const refreshToken = useGlobalState(state => state.refreshToken);

    const [provincias, setProvincias] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
    const [municipioSeleccionado, setMunicipioSeleccionado] = useState("");

    const [enviando, setEnviando] = useState(false);

    const [formulario, setFormulario] = useState({
        nombre: "",
        apellidos: "",
        empresa: "",
        telefono: "",
        direccion: "",
        municipio: "",
        provincia: "",
        cp: "",
        pais: "",
        esFacturacion: false,
        esPrincipal: false
    });

    const handleCheckEnvio = (ev) => {
        const checked = ev.target.checked;
        setFormulario(form => ({
            ...form,
            esPrincipal: checked,
        }));
    };

    const handleCheckFacturacion = (ev) => {
        const checked = ev.target.checked;
        setFormulario(form => ({
            ...form,
            esFacturacion: checked,
        }));
    };

    const handleChange = (ev) => {
        setFormulario({
            ...formulario,
            [ev.target.id]: ev.target.value
        });
    }

    const handleChangeProvincia = (ev) => {
        setProvinciaSeleccionada(ev.target.value);
        setMunicipioSeleccionado('');
    };

    const handleChangeMunicipio = (ev) => {
        setMunicipioSeleccionado(ev.target.value);
    }



    const formularioValido = useMemo(() => {
        return (
            formulario.nombre.trim() &&
            formulario.apellidos.trim() &&
            formulario.telefono.trim() &&
            formulario.direccion.trim() &&
            provinciaSeleccionada &&
            municipioSeleccionado &&
            formulario.cp.trim() &&
            formulario.pais.trim()
        );
    }, [formulario, provinciaSeleccionada, municipioSeleccionado]);



    useEffect(() => {
        async function fetchProvincias() {
            try {
                const response = await fetch('http://localhost:3000/api/geo?type=provincias');

                if (!response.ok) throw new Error("Error al cargar provincias");

                const data = await response.json();
                setProvincias(data.data);
            } catch (err) {
                console.error("Error cargando provincias:", err);
                setProvincias([]);
            }
        }
        fetchProvincias();
    }, []);

    useEffect(() => {
        async function fetchMunicipios() {
            try {
                const response = await fetch(`http://localhost:3000/api/geo?type=municipios&CPRO=${provinciaSeleccionada}`);

                if (!response.ok) throw new Error("Error al cargar municipios");

                const data = await response.json();
                setMunicipios(data.data);
            } catch (err) {
                console.error("Error cargando municipios:", err);
                setMunicipios([]);
            }
        }
        fetchMunicipios();
    }, [provinciaSeleccionada]);


    useEffect(() => {
        if (modo === 'EDITAR' && direccion) {
            setFormulario({
                nombre: direccion.datosContacto.nombre,
                apellidos: direccion.datosContacto.apellidos,
                empresa: direccion.datosContacto.empresa,
                telefono: direccion.datosContacto.telefono,
                direccion: direccion.calle,
                cp: direccion.cp,
                pais: direccion.pais,
                esFacturacion: !!direccion.esFacturacion,
                esPrincipal: !!direccion.esPrincipal
            });
            const cpro = direccion.provincia.CPRO;
            const cmum = direccion.municipio.CMUM;
            setProvinciaSeleccionada(cpro);
            setMunicipioSeleccionado(cmum);
        }
    }, [modo, direccion]);


    async function guardarDireccion() {

        const provObj = provincias.find(prov => String(prov.CPRO) === String(provinciaSeleccionada));

        const munObj = municipios.find(mun => {
            return String(mun.CPRO) === String(provinciaSeleccionada)
                && String(mun.CMUM) === String(municipioSeleccionado);
        });

        const direccionEnviar = {
            calle: formulario.direccion,
            cp: formulario.cp,
            pais: formulario.pais,
            municipio: munObj,
            provincia: provObj,
            esPrincipal: !!formulario.esPrincipal,
            esFacturacion: !!formulario.esFacturacion,
            datosContacto: {
                nombre: formulario.nombre,
                apellidos: formulario.apellidos,
                empresa: formulario.empresa || '',
                telefono: formulario.telefono
            }
        };

        const operacion = modo === 'EDITAR' ? 'UPDATE' : 'ADD';
        const idDireccion = modo === 'EDITAR' && direccionEnviar ? direccion._id : undefined;


        setEnviando(true);

        try {
            const respuesta = await fetch('http://localhost:3000/api/Cliente/Direccion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'X-REFRESH-TOKEN': refreshToken
                },
                body: JSON.stringify({
                    operacion,
                    direccion: direccionEnviar,
                    ...(idDireccion ? { idDireccion } : {})
                })
            });

            const nuevoAccessToken = respuesta.headers.get('X-NEW-ACCESS-TOKEN');
            if (nuevoAccessToken) setAccessToken(nuevoAccessToken);

            let datos = await respuesta.json();

            if (respuesta.ok && datos.codigo === 0) {

                onDireccionSaved({
                    ok: true,
                    message: (modo === 'EDITAR' ? 'Dirección actualizada correctamente' : 'Dirección añadida correctamente'), direccion: datos.direccion
                });

                setFormulario({
                    nombre: "",
                    apellidos: "",
                    empresa: "",
                    telefono: "",
                    direccion: "",
                    municipio: "",
                    provincia: "",
                    cp: "",
                    pais: "",
                    esFacturacion: false,
                    esPrincipal: false
                });

                setProvinciaSeleccionada("");
                setMunicipioSeleccionado("");

                if (modo === 'EDITAR' && onCloseEditar) {
                    onCloseEditar();
                }

            } else {
                onDireccionSaved({ 
                    ok: false, 
                    message: datos.message || (modo === 'EDITAR' ? 'Error actualizando la dirección' : 'Error añadiendo la dirección') 
                });
            }

            setEnviando(false);

        } catch (error) {
            console.error("Error guardando dirección:", error);
            onDireccionSaved({ 
                ok: false, 
                message: (modo === 'EDITAR' ? 'Error actualizando la dirección' : 'Error añadiendo la dirección') 
             });
            setEnviando(false);
        }

    }

    const textoBoton = modo === 'EDITAR' ? 'GUARDAR CAMBIOS' : 'AÑADIR DIRECCION';
    const tituloModal = modo === 'EDITAR' ? 'Editar la Direccion' : 'Alta de nueva Direccion';


    return (
        <div className='modal fade' id='modalDirecciones' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='modalDireccionesLabel' aria-hidden='true'>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className='modal-header'>
                        <h2 className='modal-title fs-5' id='modalDireccionesLabel'>{tituloModal}</h2>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className='modal-body'>
                        <div className='container'>

                            <div className='row mt-2'>
                                <div className='col-12'>
                                    <h5 style={{ borderBottom: '1px solid #ccc' }}>Informacion de contacto</h5>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre<em> *</em></label>
                                        <input type="text" className="form-control" id="nombre" value={formulario.nombre} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label htmlFor="apellidos" className="form-label">Apellidos<em> *</em></label>
                                        <input type="text" className="form-control" id="apellidos" value={formulario.apellidos} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className="mb-3">
                                        <label htmlFor="empresa" className="form-label">Empresa</label>
                                        <input type="text" className="form-control" id="empresa" value={formulario.empresa} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className="mb-3">
                                        <label htmlFor="telefono" className="form-label">Telefono<em> *</em></label>
                                        <input type="text" className="form-control" id="telefono" value={formulario.telefono} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <div className='row mt-4'>
                                <div className='col-12'>
                                    <h5 style={{ borderBottom: '1px solid #ccc' }}>Datos Direccion</h5>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className="mb-3">
                                        <label htmlFor="direccion" className="form-label">Direccion (Calle, Numero, Portal, Piso...)<em> *</em></label>
                                        <input type="text" className="form-control" id="direccion" value={formulario.direccion} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label htmlFor="municipio" className="form-label">Ciudad o Municipio<em> *</em></label>
                                        <select className="form-select" id="municipio" value={municipioSeleccionado} onChange={handleChangeMunicipio} disabled={!provinciaSeleccionada}>
                                            <option value="">Selecciona un municipio</option>
                                            {municipios.map(mun => (
                                                <option key={`${mun.CPRO}-${mun.CMUM}`} value={mun.CMUM}>{mun.DMUN50}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label htmlFor="provincia" className="form-label">Provincia<em> *</em></label>
                                        <select className="form-select" id="provincia" value={provinciaSeleccionada} onChange={handleChangeProvincia}>
                                            <option value="">Selecciona una provincia</option>
                                            {provincias.map(prov => (
                                                <option key={prov.CPRO} value={prov.CPRO}>{prov.PRO}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>


                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label htmlFor="cp" className="form-label">Codigo Postal<em> *</em></label>
                                        <input type="text" className="form-control" id="cp" value={formulario.cp} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label htmlFor="pais" className="form-label">Pais<em> *</em></label>
                                        <input type="text" className="form-control" id="pais" value={formulario.pais} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-12'>
                                    <input
                                        className="form-check-input"
                                        type="checkbox" value=""
                                        id="checkFacturacion"
                                        checked={formulario.esFacturacion}
                                        onChange={handleCheckFacturacion}
                                        style={{ opacity: 1, display: 'flex', alignItems: 'center' }}
                                    />
                                    <label className="form-check-label" htmlFor="checkFacturacion">
                                        Direccion de Facturacion
                                    </label>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-12'>
                                    <input
                                        className="form-check-input"
                                        type="checkbox" value="" id="checkEnvio"
                                        checked={formulario.esPrincipal}
                                        onChange={handleCheckEnvio}
                                        style={{ opacity: 1, display: 'flex', alignItems: 'center' }}
                                    />
                                    <label className="form-check-label" htmlFor="checkEnvio">
                                        Direccion de envio predeterminada (principal)
                                    </label>
                                </div>
                            </div>

                            <div className='row mt-4'>
                                <div className='col-md-12 d-flex justify-content-end mb-4'>
                                    <button
                                        type="button"
                                        className="btn btn-hsn-1"
                                        onClick={guardarDireccion}
                                        disabled={!formularioValido || enviando}
                                    >
                                        <i className="fa-solid fa-check"></i> {enviando ? 'Guardando...' : textoBoton}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalDirecciones;
