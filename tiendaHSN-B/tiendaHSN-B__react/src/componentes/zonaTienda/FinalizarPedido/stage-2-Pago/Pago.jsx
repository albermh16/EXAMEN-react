import './Pago.css'
import { useState,useEffect } from 'react';
import useGlobalState from '../../../../globalState/stateGlobal';

function Pago() {
  const [formaPago, setFormaPago]=useState({ tipo:'PayPal', detalles:{} });
  const {setPedido}=useGlobalState();
  

    useEffect(() => {
    setPedido('setMetodoPago', formaPago);
  }, [formaPago]);
  
  //--------- manejador de cambios en los inputs del formulario de tarjeta de credito -------------
  function handlerChangeInputs(ev){
    const { name, value }=ev.target;
    setFormaPago( state => ({ ...state, detalles: { ...state.detalles, [name]: value } }) );
    console.log('formaPago:', formaPago);
    // comprobamos si ya tenemos todos los datos necesarios para guardar el metodo de pago en el pedido
    ['numeroTarjeta','nombre','mes','anio','codigoSeguridad'].filter( campo => ! formaPago.detalles[campo]  ).length === 0 && setPedido(  'setMetodoPago', formaPago  );
  }



  return (
    <div className='container'>

        <div className='row mt-4 mb-4'>
            <div className='col'>
                <h2>¿ Como quieres pagar ?</h2>
                <hr />
            </div>
        </div>

                {
                  [
                    "Tarjeta de Credito/Debito", 
                    "PayPal", 
                    "Bizum", 
                    "Transferencia Bancaria"
                  ].map( 
                      (metodo, index) =>
                                      <div className='row m-2' key={index}>
                                        <div className='col'>
                                          <div className="form-check" style={{height:'60px', display:'flex', alignItems:'center',  borderRadius:'8px', border:`2px solid ${formaPago.tipo===metodo ? '#00b22d':'#999'}`}}>
                                                <input className="form-check-input" style={{padding:'10px'}} type="radio" name="radioTipoPago" id={metodo} checked={formaPago.tipo===metodo} onChange={()=>setFormaPago({ ...formaPago, tipo: metodo  })}/>
                                                <label className="form-check-label" htmlhtmlFor={metodo} style={{color:`${formaPago.tipo===metodo ? '#666' : '#999'}`, fontWeight:'600', fontSize:'1.1em'}}>
                                                    {metodo} <img src={`/images/${metodo.replace(/[ \/]/g,'').toLowerCase()}_icon.png`} alt={metodo} style={{  height:'45', filter: `${formaPago.tipo===metodo ? 'grayscale(0)':'grayscale(100%)'}`}} />
                                                </label>
                                          </div>
                                          { metodo==='Tarjeta de Credito/Debito' && formaPago.tipo==='Tarjeta de Credito/Debito' && (
                                            <div className='container' style={{backgroundColor:'#f1f1f1', padding:'10px', borderRadius:'8px', marginTop:'10px'}}>

                                              <div className='row mt-3'>
                                                <div className="col-6">
                                                  <label htmlFor="inputNombreTitular" className="form-label">Nombre del Titular</label>
                                                  <input type="text" name='nombre' className="form-control" id="inputNombreTitular" onChange={handlerChangeInputs}/>
                                                </div>
                                                <div className="col-6">
                                                  <label htmlFor="inputTarjeta" className="form-label">Numero de Tarjeta</label>
                                                  <input type="text" name='numeroTarjeta' className="form-control" id="inputTarjeta" onChange={handlerChangeInputs}/>
                                                </div>                                                                                            
                                              </div>

                                              <div className='row mt-3 mb-3'>
                                                <div className="col-3">
                                                  <label htmlFor="selectMes" className="form-label">Fecha de Caducidad</label>
                                                  <select className='form-select' id="selectMes" placeholder='Mes' name='mes' onChange={handlerChangeInputs}>
                                                    {
                                                      ["Mes","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((mes, index) => (
                                                        <option key={index} value={String(index + 1).padStart(2, '0')}>{mes}</option>
                                                      ))
                                                    }
                                                  </select>
                                                </div>
                                                <div className="col-3">
                                                  <label htmlFor="selectAnio" className="form-label">.</label>
                                                  <select className='form-select' id="selectAnio" placeholder='Año' name='anio' onChange={handlerChangeInputs}>
                                                    <option value="">Año</option>
                                                    {
                                                      Array.from({ length: 12 }, (_, i) => new Date().getFullYear() + i).map((anio, index) => (
                                                        <option key={index} value={anio}>{anio}</option>
                                                      ))
                                                    }
                                                  </select>
                                                </div>                                                                                            
                                                <div className="col-6">
                                                  <label htmlFor="inputCodigoSeguridad" className="form-label">Codigo de seguridad</label>
                                                  <input type="text" name='codigoSeguridad' className="form-control" id="inputCodigoSeguridad" onChange={handlerChangeInputs}/>
                                                </div>

                                              </div>

                                            </div>
                                          )
                                          }
                                        </div>
                                    </div>
                       )
                }

    
    </div>
  )

}
export default Pago