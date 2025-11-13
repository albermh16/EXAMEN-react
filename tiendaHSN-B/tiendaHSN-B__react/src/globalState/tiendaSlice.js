export default function tiendaSlice(set,get,store){
    return {
            pedido: {
                itemsPedido:[], //array de objetos de esta forma: { idProducto:..., cantidad: ...}
                codigoDescuento:[], //codigo de descuento aplicado
                metodoPago: {}, //<--- objeto asi: { tipo: 'Tarjeta credito| paypal  | ...', detalles: { numeroTarjeta: '**** **** **** 1234', titular: 'Juan Perez', fechaCaducidad: '12/25' } }
                metodoEnvio: {}, //<--- objeto asi: { transportista: 'DHL | SEUR | MRW | ...', servicio: '24h | 48h | ...', coste: 5.99 }
                fechaPago:null, //fecha en q se realizo el pago
                fechaEnvio:null, //fecha en q se envio el pedido
                estado:'', //estado del pedido (pagado, enviado, entregado, cancelado),
                direccionEnvio: null, //direccion de envio del pedido
                direccionFacturacion: null, //direccion de facturacion del pedido
                subtotal:0,
                gastosEnvio:0,
                total:0
            },
            //acciones....
            setPedido: ( accion, itemPedido )=> set( state =>{
                console.log(`accion en setPedido: ${accion}, itemPedido: ${JSON.stringify(itemPedido)}`);
                
                switch(accion){
                    case 'setDirEnvio':
                    case 'setDirFacturacion':
                          return { 
                                    ...state, 
                                    pedido: { 
                                        ...state.pedido, 
                                        [ accion === 'setDirEnvio' ? 'direccionEnvio' : 'direccionFacturacion' ]: itemPedido 
                                    } 
                                };
                    case 'setMetodoPago':
                          return { 
                                    ...state,
                                    pedido: { 
                                        ...state.pedido, 
                                        metodoPago: itemPedido 
                                    } 
                                };
                    default:
                        //como vamos a modificar el array de itemsPedido, primero hacemos una copia del array
                        let _items=[...state.pedido.itemsPedido];
                        let _posArray=_items.findIndex( item => item.producto._id === itemPedido.producto._id );
                                        
                        switch(accion){
                            case 'agregar':
                                console.log(`estamos agregando un producto al pedido: ${JSON.stringify(itemPedido)}`);
                                //_items.push(itemPedido); //<---- si solo hago esto, el problema esta al añadir el mismo producto varias veces
                                //hay q comprobar si el producto ya existe en el array, si existe, solo actualizo la cantidad: metodo findIndex
                                if( _posArray >= 0 ){
                                    //el producto ya existe en el array, solo actualizo la cantidad
                                    _items[_posArray].cantidad += itemPedido.cantidad;
                                }else{
                                    //el producto no existe en el array, lo añado
                                    _items.push(itemPedido);
                                }
                                break;
                        
                            case 'eliminar':
                                console.log(`estamos eliminando un producto del pedido: ${JSON.stringify(itemPedido)}`);
                                _items=_items.filter( item => item.producto._id !== itemPedido.producto._id );
                                break;
                        
                            case 'modificar':
                                console.log(`estamos modificando un producto del pedido: ${JSON.stringify(itemPedido)}`);
                                if( _posArray >= 0 ){
                                    //el producto ya existe en el array, solo actualizo la cantidad
                                    _items[_posArray].cantidad = itemPedido.cantidad;
                                }
                                break;
                        }
                        //como modifcamos el array de itemsPedido, tenemos q actualizar el objeto pedido y recalcular subtotal y total
                        //para calcular el subtotal, tenemos q recorrer el array de itemsPedido y sumar el precio de cada producto por su cantidad
                        let _subtotal=_items.reduce( (acum, item) => acum + (item.producto.Precio * (1 - item.producto.Oferta/100) * item.cantidad), 0);
                        let _totalPagar=_subtotal + state.pedido.gastosEnvio;
                        return { 
                                ...state, 
                                pedido: { 
                                            ...state.pedido, 
                                            itemsPedido: _items, 
                                            subtotal:_subtotal, 
                                            total:_totalPagar 
                                        }
                                    }
                }
        
                
            })
        }
    
}