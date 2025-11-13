import './Envio.css'
import { useState, useEffect } from 'react';
import FormDirec from './FormDirEnvioFact/FormDirec';
import useGlobalStore from '../../../../globalState/stateGlobal';

function Envio() {
  let {cliente, setCliente, setPedido}=useGlobalStore();
  console.log('valor de cliente en Envio.jsx: ', cliente);

  const [ mostrarFactCheck, setMostrarFactCheck ]=useState(true); //si es true mostramos los datos de facturacion, si es false mostramos el formulario para introducir nuevos datos de facturacion
  const [ nuevaDirec, setNuevaDirec ]=useState({ dirEnvio: false, dirFacturacion: false}); //si es true mostramos el formulario para introducir nueva direccion de envio  

 useEffect(
    () => {
        if (cliente.direcciones.length > 0 ) {
          setPedido( 'setDirEnvio', cliente.direcciones.find( dir => dir.esPrincipal ) );
          setPedido( 'setDirFacturacion', cliente.direcciones.find( dir => dir.esFacturacion ) );
        }
    },
    []
  )

  return (
    <div className='container'>

        <div className='row'>
            <div className='col'>
                <h2>¿ A quién lo enviamos ?</h2>
                <hr />
            </div>
        </div>
        
        <div className='row mt-2'>
            <div className='col'>
                <select name='direccionesEnv' id='direccionesEnv' className='form-select' onChange={ (ev)=> setNuevaDirec({ ...nuevaDirec, dirEnvio: ev.target.value==='nueva' ? true : false }) }>
                    {
                        cliente.direcciones && cliente.direcciones.length > 0 && ( 
                        cliente.direcciones.map((dir, index) => (
                            <option key={index} defaultValue={dir.esPrincipal==true}>{dir.datosContacto.nombre} {dir.datosContacto.apellidos}, {dir.calle}, {dir.municipio.DMUN50} ({dir.provincia.PRO}) cp.{dir.cp}</option>
                        ))
                      ) 
                    }
                    <option value='nueva'>Añadir nueva dirección</option>
                </select>
            </div>
        </div>

        {
            nuevaDirec.dirEnvio && 
            <div className='row mt-2'>
              <div className='col'>
                <FormDirec esFacturacion={false} setCliente={setCliente} setNuevaDirec={setNuevaDirec} />
              </div>
            </div>
        }

        <div className='row mt-4 mb-2'>
            <div className='col'>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="checkChecked" defaultChecked={mostrarFactCheck} onChange={ (ev)=> { setMostrarFactCheck(ev.target.checked); setNuevaDirec({ ...nuevaDirec, dirFacturacion: false }); } }/>
                <label className="form-check-label" htmlFor="checkChecked">
                    <span style={{ color:'#666', fontStyle:'italic', fontWeight:'400', fontSize:'0.75em'}}>Utilizar estos datos de facturación</span>
                </label>
              </div>
            </div>
        </div>
 

        {  ! mostrarFactCheck  && (
          
            <> 
                <hr/>
                <div className='row'>
                  <div className='col'>
                      <h2>Datos de facturacion</h2>
                  </div>
                </div>
                <div className='row'>
                    <div className='col'>                        
                        <select name='direccionesFact' id='direccionesFact' className='form-select' onChange={ (ev)=> setNuevaDirec({ ...nuevaDirec, dirFacturacion: ev.target.value==='nuevaFact' ? true : false }) }>
                            {
                                cliente.direcciones.filter(dir => dir.esFacturacion).map((dir, index) => (
                                    <option key={index} defaultValue={dir.esPrincipal==true}>{dir.datosContacto.nombre} {dir.datosContacto.apellidos}, {dir.calle}, {dir.municipio.DMUN50} ({dir.provincia.PRO}) cp.{dir.cp}</option>
                                ))
                            }
                            <option value='nuevaFact'>Añadir nueva dirección</option>
                        </select>
                    </div>
                </div>
            </>
                )
        } 

        {
            nuevaDirec.dirFacturacion && ! mostrarFactCheck &&
            <div className='row mt-2'>
              <div className='col'>
                <FormDirec esFacturacion={true} setCliente={setCliente} setNuevaDirec={setNuevaDirec}/>
              </div>
            </div>
        }

        <div className='row mt-4'>
            <div className='col'>
                <h2>¿ Cómo lo enviamos ?</h2>
                <hr />
            </div>
        </div>        

        <div className='row m-4'>
            <div className='col'>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="radioDefault" id="puntoRecogida"/>
                <label className="form-check-label" htmlFor="radioDefault1" style={{color:'#999', fontWeight:'600', fontSize:'1.1em'}}>
                  <i className="fa-solid fa-building"></i> PUNTO DE RECOGIDA 
                  <span class="eco-message">¡El más ECO! <strong>Te damos 50 puntos HSN</strong></span>
                </label>
              </div>
            </div>
        </div>

        <div className='row m-4'>
            <div className='col'>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="radioDefault" id="DomicilioStandard" checked/>
                <label className="form-check-label" htmlFor="DomicilioStandard" style={{color:'#000', fontWeight:'600', fontSize:'1.1em', fontStyle:'bold'}}>
                  <i class="fa-solid fa-truck"></i> A DOMICILIO ESTANDAR 
                </label>
              </div>
            </div>
        </div>

        <div className='row m-4'>
            <div className='col'>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="radioDefault" id="DomicilioExpress"/>
                <label className="form-check-label" htmlFor="DomicilioExpress" style={{color:'#999', fontWeight:'600', fontSize:'1.1em'}}>
                  <i class="fa-solid fa-truck-fast"></i> A DOMICILIO EXPRESS
                </label>
              </div>
            </div>
        </div>


    </div>
  )
}

export default Envio