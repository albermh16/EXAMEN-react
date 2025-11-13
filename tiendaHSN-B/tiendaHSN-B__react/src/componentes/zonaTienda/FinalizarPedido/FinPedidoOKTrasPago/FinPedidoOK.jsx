import './FinPedidoOk.css'
import {  Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import useGlobalStore from '../../../../globalState/stateGlobal';
import ResumenPedido from '../FinPedidoComp/ResumenPedido/ResumenPedido';
import { use } from 'react';

function FinPedidoOk(){
    const { pedido, cliente, setPedido }=useGlobalStore();

    return (
        <div className="container">
                <div className="row">
                </div>

                <div className="row m-4">
                    <div className="col-8">
                        <div className='d-flex flex-column'>
                            <img src="/images/pedidoOK.jpg" style={{width: "200px", height: "200px"}} alt="..."/>
                            <h5>Pago del pedido con id: {pedido._id} { pedido.metodoPago.tipo=='PayPal' && `en PayPal: ${pedido.metodoPago.detalles.orderID}`} realizado correctamente</h5>
                            { pedido.metodoPago.tipo=='PayPal' && 
                            <div className='d-flex flex-column'>
                                <span className='text-small'>id cuenta Paypal: {pedido.metodoPago.detalles.payer?.payer_id || ''}</span>
                                <span className='text-small'>email cuenta Paypal: {pedido.metodoPago.detalles.payer?.email_address || ''}</span>
                                <span className='text-small'>nombre y apellidos usuario cuenta Paypal: { `${pedido.metodoPago.detalles.payer?.name.given_name || ''} ${pedido.metodoPago.detalles.payer?.name.surname || ''}`}</span>
                            </div>
                            }
                        </div>

                        <hr/>
                        
                        <div>
                            <p>Gracias por tu compra, {cliente.nombre} {cliente.apellidos}!</p>
                            <p>Se te ha mandado un email a <span style={{color:'green'}}>{cliente.cuenta.email}</span> con la factura del mismo (consulta la bandeja de entrada de tu correo o el spam por si acaso).</p>
                            <p> Accede al panel de tu USUARIO para ver la lista de pedidos que has hecho en la tienda.</p>
                            <Link className="btn btn-success w-100" to="/Cliente/Panel/MisDatos">IR A MI PANEL</Link>

                        </div>
                    </div>
                    <div className="col-4">
                        <ResumenPedido pedido={pedido}/>
                    </div>
                </div>

        </div> 
    )
}

export default FinPedidoOk