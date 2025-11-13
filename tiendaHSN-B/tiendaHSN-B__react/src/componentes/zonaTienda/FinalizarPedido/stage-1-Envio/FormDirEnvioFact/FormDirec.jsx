import './FormDirec.css'
import { useState, useEffect } from 'react';

function FormDirec( { esFacturacion, setCliente, setNuevaDirec } ) { 
    //#region --------------- state del componente ---------------------    
    const [ provincias, setProvincias ]=useState([]);
    const [ municipios, setMunicipios ]=useState([]);
    const [ datosDirec, setDatosDirec ]=useState({
        nombre: '',
        apellidos: '',
        telefono: '',
        calle: '',
        provincia: { CPRO:'', PRO:'', CCOM:'' },
        municipio: { CPRO:'', CMUM:'', DMUN50:'', CUN:'' },
        pais: 'España',
        cp: '',
        cif: '',
        esPrincipal: true,
        esFacturacion: true
    });
    //#endregion

    //#region --------------- efectos del componente  ---------------------

    //#endregion

    function handleInputChange( ev ) {
        const { name, value }=ev.target;
        setDatosDirec( state => ({ ...state, [name]: value }) );
    }

  return (
    <div className='container'>

        <div className='row'>
            <div className='col-6'>
                <label for="txtNombre" className="form-label">Nombre</label>
                <input type="text" className="form-control" id="txtNombre" name="nombre" placeholder="Introduce tu nombre" onChange={handleInputChange} />
            </div>
            <div className='col-6'>
                <label for="txtApellidos" className="form-label">Apellidos</label>
                <input type="text" className="form-control" id="txtApellidos" name="apellidos" placeholder="Introduce tus apellidos" onChange={handleInputChange} />
            </div>
        </div>

        <div className='row'>
            <div className='col-6'>
                <label for="txtTelefono" className="form-label">Teléfono</label>
                <input type="text" className="form-control" id="txtTelefono" name="telefono" placeholder="Introduce tu teléfono" onChange={handleInputChange} />
            </div>
        </div>

        <div className='row'>
            <div className='col'>
                <label for="txtCalle" className="form-label">Calle</label>
                <input type="text" className="form-control" id="txtCalle" name="calle" placeholder="Introduce tu calle, numero, piso, letra..." onChange={handleInputChange} />
            </div>
        </div>

        <div className='row'>
            <div className='col-6'>
                <label for="txtProvincia" className="form-label">Provincia</label>
                <select id="txtProvincia" name="provincia" className="form-select" >
                    <option selected>Selecciona una provincia</option>
                </select>
            </div>
            <div className='col-6'>
                <label for="txtMunicipio" className="form-label">Municipio</label>
                <select id="txtMunicipio" name="municipio" className="form-select" >
                    <option selected>Selecciona un municipio</option>
                </select>
            </div>
        </div>

        <div className='row'>
            <div className='col-6'>
                <label for="txtPais" className="form-label">País</label>
                <input type="text" className="form-control" id="txtPais" name="pais" value="España" placeholder="Introduce tu país" disabled />
            </div>
            <div className='col-6'>
                <label for="txtCP" className="form-label">Código Postal</label>
                <input type="text" className="form-control" id="txtCP" name="cp" placeholder="Introduce tu código postal" onChange={handleInputChange}/>
            </div>
        </div>
 
        {
            esFacturacion &&    
                <div className='row'>
                    <div className='col-6'>
                        <label for="txtCIF" className="form-label">CIF/NIF</label>
                        <input type="text" className="form-control" id="txtCIF" name="cif" placeholder="Introduce el CIF/NIF de la empresa/particular" onChange={handleInputChange}/>
                    </div>
                </div>
        }

        {
            ! esFacturacion &&                
                <div className='row mt-3'>
                    <div className='col'>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="checkEsPrincipal" checked={datosDirec.esPrincipal} onChange={ev => setDatosDirec(state => ({...state, esPrincipal: ev.target.checked}))}/>
                            <label className="form-check-label" for="checkEsPrincipal" style={{ color:'#666', fontStyle:'italic', fontWeight:'400', fontSize:'0.75em'}}>
                                Usar como mi direccion de envio por defecto
                            </label>
                        </div>
                    </div>
                </div>
        }

        <div className='row'>
            <div className='col d-flex justify-content-end'>
                <button className='btn btn-success hsn-1'>Guardar dirección { esFacturacion ? 'de facturación' : 'de envío' }</button>
            </div>
        </div>


    </div>
  )
}
export default FormDirec;