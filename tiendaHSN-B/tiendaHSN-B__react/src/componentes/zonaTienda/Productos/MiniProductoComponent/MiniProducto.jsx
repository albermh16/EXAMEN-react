import './MiniProducto.css'
import { useState, useEffect, use } from 'react'
import { useNavigate } from 'react-router-dom';
import  useGlobalState  from '../../../../globalState/stateGlobal';

function Miniproducto({ producto }) {
    const navigate=useNavigate(); //<---- hook de react-router-dom para provocar un salto de url por programacion, te devuelve funcion "navigate"
    
    //desestructurar objeto producto quitando imagenes, descripcion, valoraciones....y para añadir formato/sabor elegido, los arrays los transformamos asi: [ { formato/sabor:..., seleccionado: true/false}]
    let { 
          "Descripcion detallada":DescripDetail, 
          "Lista Preguntas uso": listapreg,
           Descripcion, 
           valoraciones, 
           "Detalles producto":detallesprod, 
           ...prodItem
            }= producto;

    //#region ------ State del componente ----------------
    const {pedido, setPedido}=useGlobalState();
    const [ cantidad, setCantidad ]=useState( pedido.itemsPedido.find( it => it.producto._id === producto._id)?.cantidad || 1);
    const [ productoState, setProductoState ]=useState(
                                                        {
                                                            ...prodItem,
                                                            Imagenes: prodItem.Imagenes.slice(0,1),//solo la primera imagen para el mini producto
                                                            Formato: prodItem.Formato.map( (form,index) => index === 0 ? { nombre: form, seleccionado: true } : { nombre: form, seleccionado: false } ),
                                                            Sabores: prodItem.Sabores.map( (sabor,index) => index === 0 ? { nombre: sabor, seleccionado: true } : { nombre: sabor, seleccionado: false } )  
                                                         }
                                                    ); 

    //#endregion


    //#region ------ Handlers del componente ----------------
    function HandlerAddToCart(){
        console.log(`añadiendo al carrito producto con cantidad ${cantidad}`, productoState);
        setPedido('agregar',{ producto: productoState, cantidad } )
    }

    function HandlerChangeSelect(e){
        console.log(`cambiado select ${e.target.name} a ${e.target.value}`);
        setProductoState( state => { 
            console.log(`valor de propiedad ${e.target.name} del state:`, state[e.target.name]);
            return { 
                        ...state, 
                        [e.target.name]: state[e.target.name]
                                                .map( item => item.nombre===e.target.value ? { ...item, seleccionado: true } : { ...item, seleccionado: false })
                    } 
            } 
        );
        
        console.log(`en HandlerChangeSelect productoState:`, productoState);      
    }
    //#endregion


    return (
    <div id={producto._id}  className="card m-3">
        <div className='row'>
            
            <div className='col-3' style={{ "cursor":"pointer"}} onClick={()=>navigate(`/Tienda/Producto/${producto._id}`)}>
                <div className="d-flex flex-col justify-content-center align-items-center">
                    <div><img src={ producto.Imagenes[0] } className="img-fluid rounded-start"  style={{"width":"170px","height":"170px"}} alt={ producto.Nombre }  /></div>
                    {/* el icono cuando se clickea del corazon seria:  <i className="fa-solid fa-heart"></i> */}
                    <div className='d-flex flex-row justify-content-center align-items-center'>
                        <span className='bubbles'>TOP VENTAS</span>
                    </div>
                </div>
            </div>

            <div className='col-5'>
                <div className="card-body">
                    <h5 className="card-title"><strong>{ producto.Nombre }</strong></h5>
                    { 
                        /*  estrellas segun array  producto.valoraciones y puntuacion media de las mismas */
                        Array.from({ length: 5 }, (_, i) => i).map( (el,pos)=><i key={pos} className="fa-solid fa-star" style={{color:'#ff6000'}}></i>)
                    }
                    <span style={{color:'#ff6000'}}>(0)</span>


                    <p className="card-text">{producto.Descripcion}</p>
                </div>               
            </div>

            <div className='col-4 d-flex flex-column justify-content-between mb-3 mt-2'>
                {/* precios del producto y rebajas */}
                <div className='d-flex flex-row justify-content-start align-items-center mb-2'>
                    <span style={{fontStyle:'italic', fontWeight:'bold',fontSize:'1.1em'}}> { (producto.Precio * (1- producto.Oferta/100)).toFixed(2) }€</span>
                    <span style={{textDecoration:'line-through', color:'#ccc', fontStyle:'italic'}}>{producto.Precio}€</span>
                    <span className='discount-percentage'>-{producto.Oferta}%</span>
                </div>
                
                {/* lista formatos producto */}
                <select className="form-select form-select-sm mb-2" aria-label="Default select example" name="Formato" onChange={HandlerChangeSelect}>
                {
                    producto.Formato.map( (formato, index) => <option key={index}  value={formato}>{formato}</option>)
                }
                </select>

                {/* lista sabores producto */}
                <select className="form-select form-select-sm mb-2" aria-label="Default select example" name="Sabores" onChange={HandlerChangeSelect}>
                {
                    producto.Sabores.map( (sabor, index) => <option key={index}  value={sabor}>{sabor}</option>)
                }
                </select>

                {/* lista cantidades producto */}
                <select className="form-select form-select-sm mb-2" aria-label="Default select example" name="cantidad" onChange={ (e)=>setCantidad( parseInt(e.target.value) ) } value={cantidad}>
                {
                    Array.from({ length: 12 }, (_, i) => i + 1).map( (cantidad, index) => <option key={index} value={cantidad}>{cantidad}</option>)
                }
                </select>

                {/* boton añadir al carrito */}
                <button type="button" onClick={HandlerAddToCart} className="btn btn-success" style={{ fontSize:'1.4em',backgroundColor: '#00b22d', color: 'white', border:'1px solid #00b22d', boxShadow:'0 5px 0 0 #2c942f', fontWeight:'bold', fontStyle:'italic'}}>
                    <i class="fa-solid fa-cart-shopping"></i> AÑADIR <i class="fa-solid fa-arrow-right"></i>  {(producto.Precio * producto.Oferta/100).toFixed(2)}€
                </button>

            </div>

        </div>

    </div>
)
    
}

export default Miniproducto;