import './Finalizar.css'
import useGlobalStore from '../../../../globalState/stateGlobal';
import { useNavigate } from 'react-router-dom';
import { useRef,useEffect } from 'react';

function Finalizar({setCurrentStage}) {
    const {cliente, pedido, setPedido}=useGlobalStore();
    const navigate=useNavigate();
    const windpop=useRef(null); //<----- referencia a la ventana popup de PayPal
    
    //#region --------- codigo con timer cuando  nodejs nos devuelve una redireccion a paypal q se carge en una ventana popup y comprobamos cada minuto su url  para actuar en consecuencia -----------
    //const timerCheckPopup=useRef(null); //<----- referencia al timer que comprueba si se ha cerrado la ventana popup de PayPal  

    // useEffect(
    //   ()=>{
    //     //funcion que va a comprobar cada minuto si la ventana popup de PayPal sigue abierta o se ha cerrado y ha cambiado la url y tiene la de comprobacion de compra o cancelacion
    //     timerCheckPopup.current=setInterval(
    //       ()=>{
    //         if( windpop.current ){
    //           console.log('Comprobando la url de la ventana popup de PayPal...', windpop.current.location.href );
    //           let parametrosUrl=new URLSearchParams( windpop.current.location.search ); //<--- parametros pasados en el redirect de nodjes: idCliente=...&idPedido=...&idOrderPayPal=...&cancel=...
    //           if( parametrosUrl.get('idCliente') && 
    //               parametrosUrl.get('idPedido') && 
    //               parametrosUrl.get('idOrderPayPal') && 
    //               parametrosUrl.get('cancel')!=='true'){
    //               //confirmacion de compra por parte del usuario en PayPal
    //               navigate(`/Pedido/FinPedidoOK?idCliente=${parametrosUrl.get('idCliente')}&idPedido=${parametrosUrl.get('idPedido')}&idOrderPayPal=${parametrosUrl.get('idOrderPayPal')}`);

    //               } else {
    //                 //cancelacion de compra por parte del usuario en PayPal
    //                 windpop.current.close(); //cerrar la ventana popup
    //                 alert('Has cancelado el proceso de pago con PayPal. Puedes elegir otro metodo de pago o reintentarlo.');
    //               }
    //             //...aqui manejamos la respuesta de PayPal, ya sea confirmacion o cancelacion
    //           }
    //       },60000
    //     );

    //     return ()=>{
    //       //limpiar el timer al desmontar el componente
    //       clearInterval( timerCheckPopup.current );
    //       if( windpop.current && !windpop.current.closed )windpop.current.close(); //cerrar la ventana popup si sigue abierta
    //     }
    //   },[]
    // );
    //#endregion

    useEffect(
      ()=>{
        //listener para recibir mensajes de la ventana popup de PayPal en ventana padre
        function onMsg(event){
            console.log('Mensaje recibido en ventana padre desde popup de PayPal:', event.data);

            const {idCliente,idPedido, captureOrder, cancel}=event.data;
            const { status, id, payer, payment_source } = JSON.parse(captureOrder) || {};

            if( id && status==='COMPLETED' ){
              //pago completado correctamente
              alert('Compra realizada correctamente con PayPal. En breve recibiras un email con los detalles de tu pedido y la factura.');
              
              setPedido('setMetodoPago', { tipo: 'PayPal', detalles: { orderID: id, payer, payment_source } } );
              navigate('/Pedido/FinPedidoOK');
            
            } else {
              //error en el pago
              alert('Error en la tramitacion del pago con PayPal. Por favor, reintentalo o elige otro metodo de pago.');
            }
        }
        
        window.addEventListener('message', onMsg);

        //funcion q se ejecuta al desmontar el componente, cerramos popup por si sigue abierto y eliminamos el listener y limpiamos la referencia
        return ()=>{
          if( windpop.current && !windpop.current.closed ) windpop.current.close(); //cerrar la ventana popup si sigue abierta
          window.removeEventListener('message', onMsg);        
          windpop.current=null;
        }
      },[]
    )


    async function HandlerConfCompra(){
        console.log('click en confirmar compra, pedido y datos cliente a enviar:', pedido, cliente);
        //...aqui llamariamos al endpoint de finalizar compra, enviando el objeto pedido y cliente al servidor para procesar la compra...
        try {
          const petFinPedido=await fetch('http://localhost:3000/api/Tienda/FinalizarCompra',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
               },
            body: JSON.stringify( { pedido,  cliente } ) 
              }
          );
          const datosResp=await petFinPedido.json();
          if(datosResp.codigo===0){
            //compra tramitada correctamente
            console.log('compra tramitada correctamente, datos recibidos:', datosResp.mensaje);
            
            switch (pedido.metodoPago.tipo) {
            
              case 'PayPal':
                if( datosResp.urlAprobacionPayPal){
                  //...abrir popup con la url de aprobacion de PayPal y lo metemos en la referencia para poder cerrarlo,etc
                  windpop.current=window.open( datosResp.urlAprobacionPayPal, 'Pago con PayPal', 'popup' );
                  
                  //...añadimos listener a ventana padre a evento 'message' para recibir mensajes de la ventana popup de PayPal
                  //mejor hacerlo en efecto nada mas cargar componente, no cada vez q hagamos click en el boton finalizar compra pq se añadiria varias veces el listener
                  //ejecutando multiples veces la misma funcion

                //   window.addEventListener('message', (event) => {
                //     console.log('Mensaje recibido en ventana padre desde popup de PayPal:', event.data);
                //     const {id,status,payment_source, purchase_units, payer, links}=event.data.captureOrder;
                //     if( id && status==='COMPLETED' ){
                //       //pago completado correctamente
                //       alert('Compra realizada correctamente con PayPal. En breve recibiras un email con los detalles de tu pedido y la factura.');
                //        setPedido('setMetodoPago', { tipo: 'PayPal', detalles: { orderID: id, payer, payment_source } } );
                //       navigate('/Pedido/FinPedidoOK');
                //     } else {
                //       //error en el pago
                //       alert('Error en la tramitacion del pago con PayPal. Por favor, reintentalo o elige otro metodo de pago.');
                //     }
                //   });
                 }
                
                break;
            
              case 'Tarjeta de Credito/Debito':
                //...redireccionar a  un componente de confirmacion de compra, con los datos del pedido, para consultar tu email donde se adjunta factra...
                //...limpiar el carrito de la compra...
                alert('Compra realizada correctamente. En breve recibiras un email con los detalles de tu pedido y la factura.');
                navigate('/Pedido/FinPedidoOK');

                break;

              default:
                
                break;
            }
            

          } else {
            //error en tramitacion compra...reintentarlo...mostrar un mensaje al usuario...
            console.log('error en tramitacion compra, datos recibidos:', datosResp.mensaje);
          }
        } catch (error) {
          console.log('error al tramitar el pedido:', error);
        }
    }



  return (
    <div className='container'>
        
        <div className='row mt-4'>
            <div className='col'>
                <h3>Resumen final</h3>
                <hr />
            </div>
        </div>

        <div className='row'>
            <div className='col'>
              <div className='final-message-checkout'>
                <span><i className="fa-solid fa-bag-shopping"></i>&nbsp;&nbsp;Revisa todos tus datos. Todo tiene solución, pero mejor que salga perfecto a la primera</span>
              </div>
              <div className=' d-flex justify-content-between alin-items-center'>
                <h5>Direccion de envio</h5>
                <div className="modify-link" onClick={ ()=> setCurrentStage(1)}>Modificar</div>
              </div>
              <div>
                { cliente.direcciones && cliente.direcciones.length > 0 && ( 
                    cliente.direcciones.filter(dir => dir.esPrincipal)
                                        .map( (dir, index) => 
                                                              <div key={index}>
                                                                  <p>{dir.datosContacto.nombre} {dir.datosContacto.apellidos}, {dir.calle}, {dir.municipio.DMUN50} ({dir.provincia.PRO}) cp: {dir.cp} - {dir.pais}</p>
                                                                  { dir.EsFacturacion && <span style={{ fontStyle: 'italic', fontWeight: 'bold', fontSize: '0.75em' }}>Usar para facturación*</span> }
                                                              </div>                                          
                                            )
                  )
                } 
              </div>
              <hr />
            </div>
        </div>

        <div className='row mt-3'>
            <div className='col'>
              <div className=' d-flex justify-content-between alin-items-center'>
                <h5>Forma de pago</h5>
                <div className="modify-link" onClick={ ()=> setCurrentStage(2)}>Modificar</div>
              </div>
              
              <div>
                { pedido.metodoPago.tipo } <br />
                { pedido.metodoPago.detalles.numeroTarjeta && (
                  <span>**** **** **** { pedido.metodoPago.detalles.numeroTarjeta.slice(-4) }</span>
                )}
              </div>
            </div>
        </div>
        <hr />

        <div className='row mt-3'>
            <div className='col'>
              <div className=' d-flex justify-content-between alin-items-center'>
                <h5>Metodo de envio</h5>
                <div className="modify-link" onClick={ ()=> setCurrentStage(1)}>Modificar</div>
              </div>
              <div>
                { pedido.metodoEnvio.transportista } - { pedido.metodoEnvio.servicio } ({ pedido.metodoEnvio.coste } €)
              </div>
            </div>
        </div>
        <hr />

        <div className='row mt-3'>
            <div className='col'>
                <h5>¿Alguna instruccion para el transportista? (max.40 caracteres)</h5>
                <textarea maxLength={40} className='form-control' placeholder='Escribe aqui tus instrucciones...' ></textarea>
            </div>
        </div>
        <hr />

        <div className='row m-4'>
            <div className='col d-flex flex-row justify-content-end align-items-center'>
                <button className='btn btn-hsn-1' onClick={HandlerConfCompra}>CONFIRMAR COMPRA</button>
            </div>
        </div>


    </div>
  )
}
export default Finalizar