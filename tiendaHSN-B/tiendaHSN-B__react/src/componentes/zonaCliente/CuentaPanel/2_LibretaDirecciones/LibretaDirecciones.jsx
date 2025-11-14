import './LibretaDirecciones.css';
import { useEffect, useState } from 'react';
import MiniDireccion from './MiniDireccionComp/MiniDireccion';
import ModalDirecciones from './ModalDireccionesComp/ModalDirecciones';
import useGlobalState from '../../../../globalState/stateGlobal';


function LibretaDirecciones() {
    const setCliente = useGlobalState(state => state.setCliente);
    const cliente = useGlobalState(state => state.cliente);
    const accessToken = useGlobalState(state => state.accessToken);
    const setAccessToken = useGlobalState(state => state.setAccessToken);
    const refreshToken = useGlobalState(state => state.refreshToken);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(null);
    const [dirAEliminar, setDirAEliminar] = useState(null);
    const [editar, setEditar] = useState(null);

    useEffect(() => {
        const fetchDireccionesCliente = async () => {
            try {
                let respuesta = await fetch(`http://localhost:3000/api/Cliente/Direcciones`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'X-REFRESH-TOKEN': `${refreshToken}`
                    },
                });

                const nuevoAccessToken = respuesta.headers.get('X-NEW-ACCESS-TOKEN');
                if (nuevoAccessToken) { setAccessToken(nuevoAccessToken); }

                let datos = await respuesta.json();

                console.log('Direcciones del cliente:', datos);

                setCliente({ direcciones: datos.direcciones });
                setLoading(false);

            } catch (error) {
                console.error('Error al obtener las direcciones del cliente:', error);
            }
        };
        fetchDireccionesCliente();
    }, [accessToken, refreshToken]);


    async function recargarDirecciones() {
        //funcion para recargar las direcciones del cliente desde el backend y actualizar el state global
        try {
            let respuesta = await fetch(`http://localhost:3000/api/Cliente/Direcciones`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-REFRESH-TOKEN': `${refreshToken}`
                },
            });
            const nuevoAccessToken = respuesta.headers.get('X-NEW-ACCESS-TOKEN');
            if (nuevoAccessToken) setAccessToken(nuevoAccessToken);
            let datos = await respuesta.json();
            console.log('Direcciones del cliente recargadas:', datos);

            setCliente({ direcciones: datos.direcciones });
        } catch (error) {
            console.error('Error al recargar las direcciones del cliente:', error);
        }

    }

    async function onSetDirPrincipal(direccion) {
        //funcion para establecer una direccion como principal (de envio o de facturacion)
        try {
            let respuesta = await fetch(`http://localhost:3000/api/Cliente/Direccion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'X-REFRESH-TOKEN': `${refreshToken}`
                },
                body: JSON.stringify(
                    {
                        operacion: 'SET_DEFAULT',
                        idDireccion: direccion._id,
                    })
            });
            const nuevoAccessToken = respuesta.headers.get('X-NEW-ACCESS-TOKEN');
            if (nuevoAccessToken) setAccessToken(nuevoAccessToken);
            let datos = await respuesta.json();
            console.log('Direccion establecida como principal:', datos);

            recargarDirecciones();
        } catch (error) {
            console.error('Error al establecer la direccion como principal:', error);
        }
    }

    async function onSetDirFacturacion(direccion) {
        //funcion para establecer una direccion como de facturacion
        try {
            let respuesta = await fetch(`http://localhost:3000/api/Cliente/Direccion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'X-REFRESH-TOKEN': `${refreshToken}`
                },
                body: JSON.stringify(
                    {
                        operacion: 'SET_FACTURACION',
                        idDireccion: direccion._id,
                    })
            });
            const nuevoAccessToken = respuesta.headers.get('X-NEW-ACCESS-TOKEN');
            if (nuevoAccessToken) setAccessToken(nuevoAccessToken);
            let datos = await respuesta.json();
            console.log('Direccion establecida como de facturacion:', datos);

            recargarDirecciones();
        } catch (error) {
            console.error('Error al establecer la direccion como de facturacion:', error);
        }
    }

    async function onEliminarDireccion(direccion) {
        //funcion para eliminar una direccion
        try {
            let respuesta = await fetch(`http://localhost:3000/api/Cliente/Direccion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'X-REFRESH-TOKEN': `${refreshToken}`
                },
                body: JSON.stringify(
                    {
                        operacion: 'DELETE',
                        idDireccion: direccion._id,
                    })
            });

            const nuevoAccessToken = respuesta.headers.get('X-NEW-ACCESS-TOKEN');

            if (nuevoAccessToken) setAccessToken(nuevoAccessToken);

            let datos = await respuesta.json();

            if (respuesta.status === 200 && datos.codigo === 0) {

                const updated = (cliente?.direcciones || []).filter(d => d._id !== direccion._id);
                setCliente({ direcciones: updated });

                setDirAEliminar(null);
                await recargarDirecciones();

                setMsg({ type: 'ok', text: 'Dirección eliminada correctamente.' });

            } else {
                setMsg({ type: 'error', text: datos.mensaje || 'No se pudo eliminar la dirección.' });
            }

        } catch (error) {
            console.error('Error al eliminar la direccion:', error);
        }
    }

    function closeModalById(id) {
        const el = document.getElementById(id);
        if (!el || !window.bootstrap) return;
        const inst = window.bootstrap.Modal.getInstance(el) || new window.bootstrap.Modal(el);
        inst.hide();
    }

    async function onDireccionSaved(result) {
        
        if (result.ok) {

            await recargarDirecciones();
            setMsg({ type: 'ok', text: result.message || 'Dirección guardada correctamente.' });
            setEditar(null);
            closeModalById('modalDirecciones');

        } else {

            setMsg({ type: 'error', text: result?.message || 'No se pudo guardar la dirección.' });
            
        }
    }

    const lista = cliente.direcciones || [];
    const envioDefault = lista.find(d => d.esPrincipal);
    const factDefault = lista.find(d => d.esFacturacion);
    const adicionales = lista.filter(d =>
        (!envioDefault || String(d._id) !== String(envioDefault._id)) &&
        (!factDefault || String(d._id) !== String(factDefault._id))
    );
    const noHay = lista.length === 0;


    return (
        <div className="container">
            <div className="row m-4">
                <div className="col-12">
                    <h2>Libreta de Direcciones</h2>
                    <hr />
                    <p>En esta zona puedes gestionar tanto las direcciones de tus envíos como los datos de facturación.</p>
                    {msg && (
                        <div className={`alert ${msg.type === 'ok' ? 'alert-success' : 'alert-danger'}`} role="alert">
                            {msg.text}
                        </div>
                    )}
                </div>
            </div>
            <div className="row m-4">
                <div className="col-12">
                    {noHay && (
                        <div className="alert alert-warning">No hay ninguna dirección dada de alta todavía.</div>
                    )}

                    {!noHay && factDefault && (
                        <div className="mb-3">
                            <MiniDireccion
                                dir={factDefault}
                                title="Dirección de facturación predeterminada"
                                setDirFacturacion={onSetDirFacturacion}
                                setDirPrincipal={onSetDirPrincipal}
                                onEliminarDireccion={(dir) => setDirAEliminar(dir)}
                                onModificar={(dir) => setEditar(dir)}
                            />
                        </div>
                    )}

                    {!noHay && envioDefault && (
                        <div className="mb-3">
                            <MiniDireccion
                                dir={envioDefault}
                                title="Dirección de envío predeterminada"
                                setDirFacturacion={onSetDirFacturacion}
                                setDirPrincipal={onSetDirPrincipal}
                                onEliminarDireccion={(dir) => setDirAEliminar(dir)}
                                onModificar={(dir) => setEditar(dir)}
                            />
                        </div>
                    )}

                    {!noHay && (
                        <>
                            <h5 className="mt-4">Direcciones adicionales</h5>
                            {adicionales.length === 0 && (
                                <div className="alert alert-warning mt-2">No hay direcciones adicionales.</div>
                            )}
                            {adicionales.map((d) => (
                                <div key={String(d._id)} className="mb-3">
                                    <MiniDireccion
                                        dir={d}
                                        setDirFacturacion={onSetDirFacturacion}
                                        setDirPrincipal={onSetDirPrincipal}
                                        onEliminarDireccion={(dir) => setDirAEliminar(dir)}
                                        onModificar={(dir) => setEditar(dir)}
                                    />
                                </div>
                            ))}
                        </>
                    )}



                </div>
            </div>

            <div className="row m-4">
                <div className="col-12 d-flex justify-content-end">
                    <button
                        type="button"
                        className="btn btn-hsn-1"
                        data-bs-toggle="modal"
                        data-bs-target="#modalDirecciones"
                        onClick={() => setEditar(null)}
                    >
                        <i className="fa-solid fa-plus" /> AÑADIR DIRECCION
                    </button>
                </div>
            </div>
            <div className="modal fade" id="modalConfirmDelete" tabIndex="-1" aria-labelledby="modalConfirmDeleteLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalConfirmDeleteLabel">Confirmar eliminación</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            {dirAEliminar ? (
                                <>
                                    <p>¿Seguro que quieres eliminar esta dirección?</p>
                                    <div className="border rounded p-2">
                                        <div><strong>{dirAEliminar.datosContacto.nombre} {dirAEliminar.datosContacto.apellidos}</strong></div>
                                        <div>{dirAEliminar.calle}</div>
                                        <div>
                                            {dirAEliminar.cp} {dirAEliminar.municipio.DMUN50}
                                            {dirAEliminar.municipio.DMUN50 && dirAEliminar.provincia.PRO ? ', ' : ' '}
                                            {dirAEliminar.provincia.PRO}
                                        </div>
                                        {dirAEliminar.pais && <div>{dirAEliminar.pais}</div>}
                                        {dirAEliminar.datosContacto.telefono && <div>Tel: {dirAEliminar.datosContacto.telefono}</div>}
                                    </div>
                                </>
                            ) : (
                                <p>No hay dirección seleccionada.</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                                onClick={() => onEliminarDireccion(dirAEliminar)}
                                disabled={!dirAEliminar}
                            >
                                Eliminar definitivamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ModalDirecciones 
                onDireccionSaved={onDireccionSaved}
                modo={editar ? 'EDITAR' : 'NUEVA'}
                direccion={editar}
                onCloseEditar={() => setEditar(null)}
                
                />
        </div>
    );
}

export default LibretaDirecciones;
