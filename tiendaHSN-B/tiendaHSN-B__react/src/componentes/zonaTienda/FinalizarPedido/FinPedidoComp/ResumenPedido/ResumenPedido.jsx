import './ResumenPedido.css'

function ResumenPedido({pedido}) {

    const fechaActual=new Date();
    const fechaA3dias=new Date( fechaActual.setDate(fechaActual.getDate() + 3) );

    return (
        <div className='container' style={{fontSize:'13px'}}>
            <div className='row'>
                <div className='col m-4 d-flex flex-column align-items-center justify-content-center'>
                    <span><strong>Tu pedido llegará aproximadamente entre el</strong></span>
                    <div>
                        <span style={{ fontWeight:'800', color:'#ff6000'}}>{fechaActual.toLocaleDateString()}</span> <span><strong>y el</strong></span> <span style={{ fontWeight:'800', color:'#ff6000'}}>{fechaA3dias.toLocaleDateString()}</span>

                    </div>
                </div>
            </div>
            
            {
                pedido.itemsPedido.map( (item, index) => (
                    <div className='row border-bottom mb-2' key={index} >
                        <div className='col d-flex flex-row justify-content-between align-items-center'>
                            <div className='d-flex flex-column align-items-center justify-content-start'>
                                <span><strong>{item.producto.Nombre}</strong></span>
                                <span>{ item.producto.Formato.find( form=> form.seleccionado==true)?.nombre} - {item.producto.Sabores.find( sabor=>sabor.seleccionado==true)?.nombre }</span>
                            </div>
                            <div className='d-flex flex-row align-items-center justify-content-between'>                            
                                <div> x {item.cantidad} </div>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <div> <strong>{ (item.producto.Precio * (1-item.producto.Oferta/100) * item.cantidad).toFixed(2) } €</strong> </div>
                            </div>
                        </div>
                        
                    </div>
                ))
            }
            
            <div className='row mt-4'>
                <div className='col subtotal d-flex flex-row justify-content-between align-items-center'>
                    <span>Total Parcial</span>
                    <span>{pedido.subtotal.toFixed(2)} €</span>
                </div>
            </div>
                
            <div className='row mt-2'>
                <div className='col subtotal d-flex flex-row justify-content-between align-items-center'>
                    <span>Descuento (... Puntos HSN)</span>
                    <span>0 €</span>
                </div>
            </div>
            
            <div className='row mt-2'>
                <div className='col subtotal d-flex flex-row justify-content-between align-items-center'>
                    <span>Gastos Envio</span>
                    <span style={{ color:'#00b22d', fontWeight:'800', fontSize:'1.2em'}}>{pedido.gastosEnvio.toFixed(2)} €</span>
                </div>
            </div>

            <div className='row'>
                <div className='col total d-flex flex-row justify-content-between align-items-center'>
                    <span>Total</span>
                    <span>{pedido.total.toFixed(2)} €</span>
                </div>
            </div>

            <div className='row mt-4'>
                <div className='col d-flex flex-row justify-content-center align-items-center'>
                    <img src='/images/footer_ResumenCesta_finPedido.png' alt='footer ResumenCesta' style={{ width:'75%'}} />
                </div>
            </div>

        </div>
    )
}
export default ResumenPedido;