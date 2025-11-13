import './MiniDireccion.css';
import useGlobalState from '../../../../../globalState/stateGlobal';
import { useEffect } from 'react';

function MiniDireccion({ dir, title, setDirPrincipal, setDirFacturacion, onEliminarDireccion }) {

    const contacto = dir.datosContacto;
    const municip = dir.municipio;
    const provincia = dir.provincia;
    const cp = dir.codigoPostal;

    const isDefault = !!dir.esPrincipal || !!dir.esFacturacion;
    const showDropdown = !isDefault;
    const showActions = isDefault;

    const usarAmbas = () => {
        setDirPrincipal?.(dir);
        setDirFacturacion?.(dir);
    };


    return (
        <div className='card'>
            <div className='card-body'>

                {(title || isDefault) && (
                    <h5 className="card-title mb-2">
                        {isDefault &&
                            <i className="fa-solid fa-star" style={{ color: '#ff6000', fontSize: 23 }} />}
                        {title ? ' ' + title : null}
                    </h5>
                )}

                <div className='d-flex justify-content-between mb-2'>
                    <p className='card-text'>{contacto.nombre}, {contacto.apellidos}</p>
                    {showDropdown && (
                        <>
                        {/* ------- este desplegable solo se muestra si la direccion NO ES NI la predeterminada de envio NI LA de facturacion ------- */}
                        <button className='btn  btn-dropdown dropdown-toggle btn-sm' type='button' data-bs-toggle='dropdown' aria-expanded='false'>
                            <img src='/images/3puntos-dropdown.svg' alt='dropdown' style={{ width: '4px', height: '17px' }} />
                        </button>
                        <ul className='dropdown-menu'>
                            <li><button className='dropdown-item' onClick={usarAmbas}>Usar como direccion de facturacion y envio por defecto</button></li>
                            <li><button className='dropdown-item' onClick={() => setDirPrincipal(dir)}>Usar como mi direccion de envio por defecto</button></li>
                            <li><button className='dropdown-item' onClick={() => setDirFacturacion(dir)}>Usar como mi direccion de facturacion por defecto</button></li>
                            <li><button className='dropdown-item' >Modificar datos</button></li>
                            <li><button
                                className='dropdown-item'
                                data-bs-toggle='modal'
                                data-bs-target='#modalConfirmDelete'
                                onClick={() => onEliminarDireccion?.(dir)}
                            >
                                Borrar la dirección
                            </button></li>
                        </ul>
                        </>
                    )}
                    {/* ---------------------------------------- fin desplegable  ----------------------------------------------------------------*/}
                </div>
                <p className='card-text'>{dir.calle}</p>
                <p className='card-text'> {dir.cp} {municip.DMUN50}{municip.DMUN50 && provincia.PRO ? ', ' : ''}{provincia.PRO} {cp}</p>
                <p className='card-text'>{dir.pais}</p>
                <p className='card-text'>Telefono: {contacto.telefono}</p>

                {showActions && (
                    <>
                {/* ----------------------estos botones solo se muestran si la direccion es la predeterminada de envio y de facturacion -----------*/}
                <div className='d-flex justify-content-end gap-2'>
                    <button className='btn btn-hsn-2 btn-sm'>Modificar</button>
                    <button
                        className='btn btn-hsn-2 btn-sm'
                        data-bs-toggle='modal'
                        data-bs-target='#modalConfirmDelete'
                        onClick={() => onEliminarDireccion?.(dir)}
                    >
                        Eliminar
                    </button>
                </div>
                </>
                )}
                {/* -------------------------------------------------------------------------------------------------------------------------------*/}
            </div>

        </div>




    );
}


export default MiniDireccion;
