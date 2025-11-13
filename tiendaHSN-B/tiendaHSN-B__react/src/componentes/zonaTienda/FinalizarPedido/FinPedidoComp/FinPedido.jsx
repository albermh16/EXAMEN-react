import './FinPedido.css'
import { useState, useMemo } from 'react'

import Envio from '../stage-1-Envio/Envio'
import Pago from '../stage-2-Pago/Pago';
import Finalizar from '../stage-3-Finalizar/Finalizar';
import useGlobalStore from '../../../../globalState/stateGlobal';
import ResumenPedido from './ResumenPedido/ResumenPedido';

function FinPedido() {
    const {pedido}=useGlobalStore();
    const [currentStage, setCurrentStage]=useState(1); 
    
    // meto el array de objetos stages en un usememo pq sino no lo puedo meter en el useEffect, para evitar q se re-reenderice cada vez q se ejecuta el efecto por cambio del state metemos constantes en cache
    const [stages,setStages]=useState( 
                [
                    { Key: 1, Value: "Envio", Component:<Envio />, DatosCompletados: false },
                    { Key: 2, Value: "Pago", Component: <Pago /> ,DatosCompletados: false},
                    { Key: 3, Value: "Finalizar", Component: <Finalizar setCurrentStage={setCurrentStage} />, DatosCompletados: false},
                ]
            );


    function HandlerClickFase(e){
        console.log('click en fase:', e.currentTarget);
        const step=parseInt(e.currentTarget.querySelector('.step-title').getAttribute('data-step'));
        console.log('step:', step);
        setCurrentStage( step );
    }

  return (
    <div className="container">
        <div className="row">
            {/* columna donde va a ir cambiando el contenido en funcion de la fase del pago: 1-Datos Envio, 2-Pago, 3-Confirmacion */}
            <div className="col-8">
                <div className='title'>Introduce tus datos para finalizar la compra</div>
                <hr></hr>

                <div id="onestepcheckout-steps-val" className="onestepcheckout-step">
                    <div className="steps-val-container" id="steps-val-1" onClick={HandlerClickFase}>
                        <div className={ `step-check ${currentStage === 1 && (stages[0].DatosCompletados ? "checked" : "active")}`}><i className="fa fa-check"></i></div>
                        <span className={ `step-title ${currentStage === 1 && (stages[0].DatosCompletados ? "checked" : "active")}`} data-step="1">Envío</span>
                    </div>
                    <div className="separator"></div>
                    <div className="steps-val-container" id="steps-val-2" onClick={HandlerClickFase}>
                        <div className={ `step-check ${currentStage === 2 && (stages[1].DatosCompletados ? "checked" : "active")}`}><i className="fa fa-check"></i></div>
                        <span className={ `step-title ${currentStage === 2 && (stages[1].DatosCompletados ? "checked" : "active")}`} data-step="2">Pago</span>
                    </div>
                    <div className="separator"></div>
                    <div className="steps-val-container" id="steps-val-3" onClick={HandlerClickFase}>
                        <div className={ `step-check ${currentStage === 3 && (stages[2].DatosCompletados ? "checked" : "active")}`}><i className="fa fa-check"></i></div>
                        <span className={ `step-title ${currentStage === 3 && (stages[2].DatosCompletados ? "checked" : "active")}`} data-step="3">Finalizar</span>
                    </div>
                </div>

                {/* componente de la fase actual */}
                <div className='stage-component'>
                    { stages.find( stage => stage.Key === currentStage )?.Component }
                </div>

                {
                    /* botones para avanzar o retroceder entre las fases del pedido */
                    currentStage > 0 && currentStage < 3 && (
                        <div className='d-flex flex-row justify-content-between m-4'>
                            <div onClick={()=> setCurrentStage( currentStage - 1 )} >
                                    <span style={{color:'#666', cursor:'pointer', font:'normal 1.5em "unineue", "Open Sans", sans-serif'}}><i className='fa fa-chevron-left'></i>Volver {currentStage==1 && 'al carrito'}</span>
                            </div>
                            <div onClick={()=> { setCurrentStage( currentStage + 1); setStages( stages.map( st => st.Key === currentStage ? {...st, DatosCompletados:true} : st ) ) } }>
                                    <span className='active'>Continuar<i className='fa fa-chevron-right'></i></span>
                            </div>
                        </div>
                    )    
                }



            </div>

            {/* columna con el resumen del pedido */}
            <div className="col-4">
                <ResumenPedido pedido={pedido}/>
            </div>
        </div>
    </div>
  )
}
export default FinPedido