import './MiCuenta.css';
import { Outlet } from 'react-router-dom';

function MiCuenta() {
    return (
        <div className="container">
    
            <div className="row" style={{'backgroundColor':'#ccc'}}>
                <div className="col-12">
                    <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active" aria-current="page">Mi cuenta</li>
                    </ol>
                    </nav>               
               </div>
            </div>
    
            <div className="row m-4">                
                {/* menu lateral del panel... */}
                <div className="col-3">
                    <div className="list-group">
                        {
                            [
                                {nombre:'Pagina principal', enlace:'/Cliente/Cuenta/Principal', icon:'fa-solid fa-house'},
                                {nombre:'Mis datos personales', enlace:'/Cliente/Cuenta/misDatosPersonales', icon:'fa-solid fa-user'},
                                {nombre:'Libreta de direcciones', enlace:'/Cliente/Cuenta/LibretaDeDirecciones', icon:'fa-solid fa-location-dot'},
                                {nombre:'Mis tarjetas', enlace:'/Cliente/Cuenta/misMetodosPago', icon:'fa-solid fa-credit-card'},
                                {nombre:'Mis pedidos', enlace:'/Cliente/Cuenta/misPedidos', icon:'fa-solid fa-box'},
                                {nombre:'Mis tickets', enlace:'/Cliente/Cuenta/misTickets', icon:'fa-solid fa-message'},
                                {nombre:'Mis cupones exclusivos', enlace:'/Cliente/Cuenta/misCupones'},
                                {nombre:'Mis favoritos', enlace:'/Cliente/Cuenta/misFavoritos'},
                                {nombre:'Guardados para luego', enlace:'/Cliente/Cuenta/guardadosParaLuego'},
                                {nombre:'Avisos de stock', enlace:'/Cliente/Cuenta/avisosDeStock'},
                                {nombre:'Mis opiniones de productos', enlace:'/Cliente/Cuenta/misOpinionesProductos'},
                                {nombre:'Plan Amigo', enlace:'/Cliente/Cuenta/planAmigo'},
                                {nombre:'Notificaciones', enlace:'/Cliente/Cuenta/notificaciones'},
                                {nombre:'Carritos Compartidos', enlace:'/Cliente/Cuenta/carritosCompartidos'},
                                {nombre:'Cerrar la sesion', enlace:'/Cliente/Cuenta/cerrarSesion', icon:'fa-solid fa-power-off'},

                            ].map((opcion, index)=>(
                                <a key={index} href={opcion.enlace} className={`list-group-item list-group-item-action ${window.location.href.includes(opcion.enlace) ? 'active' : ''}`} aria-current={index===0?'true':'false'}>
                                    <div className="me-2 d-inline d-flex align-items-center justify-content-between"> 
                                        {opcion.nombre} { opcion.icon && <i className={opcion.icon}></i> }
                                    </div>
                                </a>
                            ))
                        }
                    </div>
                </div>
                {/* contenido panel en funcion opcion del menu lateral ... */}
                <div className="col-9">
                        <Outlet />
                </div>
            </div>
    
        </div>
    );
}

export default MiCuenta;