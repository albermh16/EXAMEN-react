//modulo de codigo donde se define el estado global de la aplicacion con ZUSTAND
//(variables q se comparten entre todos los componentes de la aplicacion)
// para crear el estado global:
// - se crea un "store" (almacen) con la funcion "create" de ZUSTAND
// te devuelve un hook (una funcion) q puedes usar en cualquier componente
// para acceder a las variables y funciones definidas en el store
import { create } from 'zustand'
import { persist } from 'zustand/middleware'; //importamos funcion middleware "persist" para guardar el estado en localStorage automáticamente para evitar perdida de datos ante recargas de pagina

import clienteSlice from './clienteSlice';
import tiendaSlice from './tiendaSlice';

/*
const useGlobalState=create( //<---- el metodo create recibe como parametro una funcion q crea el store global
    persist(
    ( set,get,store  )=>{
        console.log(`en funcion CREATE para generar el store global, los parametros son:
                    - set: ${set.toString()}, 
                    - get: ${get.toString()}, 
                    - store: ${store}`);
        return { //<---------- el return devuelve un objeto con variables(propiedades del objeto) y acciones
                //             (funciones que cambian el valor de esas propiedades del objeto) del estado global
            cliente: JSON.parse(localStorage.getItem('cliente')) || null,// objeto con datos del cliente (si esta logueado)
            accessToken: JSON.parse(localStorage.getItem('accessToken')) || null, //token JWT del cliente (si esta logueado)
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
            setCliente: (nuevoDatoCliente)=>{
                //actualizar la propiedad "cliente" del state global, y en el localStorage q usamos de backup por si hay recarga de pagina
                set ( state => ({ ...state, cliente: { ...state.cliente, ...nuevoDatoCliente} }) );
                localStorage.setItem('cliente', JSON.stringify( { ...get().cliente, ...nuevoDatoCliente} ) );
            },
            setAccessToken: (newAccessToken)=> { 
                set(state => ({ ...state, accessToken: newAccessToken }) ); 
                localStorage.setItem('accessToken', JSON.stringify(newAccessToken)); 
            },
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
                
                
            }),
        }
    },
    
    {
        name: 'stateGlobal-storage', // nombre del item en el localStorage
        getStorage: () => localStorage, // (opcional) por defecto es localStorage, pero se puede usar sessionStorage u otro
    }
)
);
*/

const useGlobalState=create(
    persist(
                (set,get, store)=>{
                    console.log(`en funcion CREATE para generar el store global, los parametros son:
                                - set: ${set.toString()}, 
                                - get: ${get.toString()}, 
                                - store: ${store}`);    
                    return {
                        //incrusto el objeto store devuelto por la funcion clienteSlice.js (desestructurado)
                        ...clienteSlice(set,get,store),
                        //incrusto el objeto store devuelto por la funcion tiendaSlice.js (desestructurado)
                        ...tiendaSlice(set,get,store),
                    }    
                },
                {
                    name: 'stateGlobal-storage', // nombre del item en el localStorage
                    getStorage: () => localStorage, // (opcional) por defecto es localStorage, pero se puede usar sessionStorage u otro
                }
        )
);

export default useGlobalState;