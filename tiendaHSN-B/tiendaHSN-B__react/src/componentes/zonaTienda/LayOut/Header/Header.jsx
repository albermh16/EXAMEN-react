import './Header.css';
import  {  useEffect, useState,useRef } from 'react';
import {Link, Navigate} from 'react-router-dom';
import  useGlobalState  from '../../../../globalState/stateGlobal';


const Header = () => {
 //#region -------------- STATE DEL COMPONENTE -----------------
 const [categorias, setCategorias] = useState([]); // <--- variable del state para almacenar categorias principales>
 const [subcats, setSubCats] = useState([]); // subcategorias de la categoria principal activa

 const hideTimer = useRef(null); // timer para ocultar el mega panel
 const [activeParent, setActiveParent] = useState(null); // pathCategoria activa
 const [showPanel, setShowPanel] = useState(false); // mostrar/ocultar mega panel

 const {pedido, cliente}=useGlobalState();
 console.log(`objeto pedido recuperado del global state en el HEADER: ${JSON.stringify(pedido)}`);
 //#endregion

 //#region -------------- EFECTOS DEL COMPONENTE ------------------------
 //#region -------------- carga de categorias en navbaar -----------------
 //¿ como recibimos las categorias principales cargadas en el LAYOUT desde el loader de App.jsx ?
 // Hay dos formas:
 // 1- Usando el hook useLoaderData() importado de react-router-dom
 // const categorias=useLoaderData();
 // console.log(`categorias recibidas desde el LOADER del LAYOUT en el Header.jsx: ${JSON.stringify(categorias)}`);
 
 // 2- usando efecto nada mas cargar el componente Header
  useEffect(
    ()=>{
      fetch('http://localhost:3000/api/Tienda/Categorias?pathCat=principales',{ method:'GET' })
        .then( async respuesta => {
             let bodyRespuesta=await respuesta.json();
             console.log(`categorias recibidas desde el LOADER del LAYOUT en el Header.jsx: ${JSON.stringify(bodyRespuesta.categorias)}`);
             setCategorias(bodyRespuesta.categorias); //<---actualizamos el state con las categorias recibidas ¿petara? deberiamos clonarlo, no mutarlo...
        })
        .catch( error =>{
          console.log(`error en la peticion de categorias principales: ${error.message}`);
          setCategorias([]); // <--- en caso de error dejamos el array de categorias vacio
        })
      
    },
    [] //<---- array de dependencias vacio para que se ejecute solo una vez al montar el componenteº
  )

    useEffect(
    () => {
      async function fetchSubcategories() {
        if(!activeParent) { setSubCats([]); return;}
        try {
          let response = await fetch(`http://localhost:3000/api/Tienda/Categorias?pathCat=${encodeURIComponent(activeParent)}`);
          if (!response.ok) throw new Error(`error al obtener subcategorias ${response.status}`);
          let respBody = await response.json();
          console.log('Subcategorias cargadas para: ', activeParent, respBody.categorias);
          // Aquí podrías actualizar el estado para almacenar las subcategorías y renderizarlas en el panel
          if(respBody.codigo !==0) throw new Error(`error en la respuesta al obtener subcategorias, ${respBody.mensaje}`);

          let subcats=[]; 
          respBody.categorias
                  .sort( (a,b)=>  a.pathCategoria > b.pathCategoria ? 1 : -1)
			            .forEach( 
                      cat => { 
				                  if ( /^\d+-\d+$/.test(cat.pathCategoria)){
					                    //categoría de 2º nivel, añadimos propiedad 'subcategorias':
						                  subcats.push( { ...cat, subcategorias:[] } );
					                } else {
						                  //categoría terciaria a procesar y a añadir a array 'subcategorias' creado arriba
				                      let catppal=subcats.find( c=> new RegExp(`${cat.pathCategoria.split('-').slice(0,2).join('-')}$`).test(c.pathCategoria));	
				                      //console.log('categoría ppal a la q pertence subcat..',cat.pathCategoria.split('-').slice(0,2).join('-'), catppal);				
				                      catppal['subcategorias'].push(cat);
					                } 
                     }
                  );

          console.log('Subcategorias procesadas: ', subcats);
          setSubCats(subcats);

        } catch (error) {
          console.error('Error cargando subcategorías:', error);
          setSubCats([]);
        }
      }
      fetchSubcategories();

  }, [activeParent]);
  
 //#endregion
 //#endregion

//#region -------------- FUNCIONES MANEJADORAS DE EVENTOS ------------------
  // Construir árbol simple de categorías cuando cambian las categorias
    const handleEnterParent = (categoria) => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setActiveParent(categoria.pathCategoria);
    setShowPanel(true);
  };

  const handleLeaveAll = () => {
    // esperar un poco antes de ocultar para permitir mover el raton al panel
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setShowPanel(false);
      setActiveParent(null);
      hideTimer.current = null;
    }, 180);
  };

  const handleEnterPanel = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setShowPanel(true);
  };

  const handleLeavePanel = () => {
    handleLeaveAll();
  };

//#endregion

//   // manejar timers para mostrar/ocultar el panel sin parpadeos

  return (
    <div className='container'>

      <div className='row'>
        <div className='col d-flex flex-row justify-content-between' style={{ color: '#999', borderBottom:'1px solid #f1f1f1', fontWeight:'400', fontFamily:'"Roboto","Open Sans",sans-serif' }}>          
          <div><p>Envio gratuito a partir de 29,99€*</p></div>
          <div><p style={{ textAlign:'center'}}><a href="https://www.hsnstore.com/contacts" style={{ textDecoration:'underline', color:'inherit' }}>Contacta con nosotros aqui</a></p></div>
          <div>
            {
              cliente ? (
                <>                
                  <div className="dropdown">
                    <button className="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <span >Hola, {cliente.nombre} {cliente.apellidos} ({cliente.cuenta.email})</span>
                    </button>
                    <ul className="dropdown-menu">
                      {
                        ['Mis datos personales', 'Mis Pedidos', 'Mis Tickets', 'Plan Ahorro', 'Libreta de direcciones', 'Guardados para luego', 'Mis favoritos', 'Puntos HSN', 'Plan Amigo', 'SALIR'].map( (item,pos) => 
                          <li key={pos}><a className="dropdown-item" href={`/Cliente/Cuenta/${item.replace(/\s+/g, '').toLowerCase()}`}><span style={{ fontSize: '0.9em' }}>{item}</span></a></li>
                        )
                      }
                    </ul>
                  </div>                  
                </>
              ) : (
                <>                
                  <a href="/Cliente/Login" style={{  marginRight:8 }}>Iniciar sesión</a>
                  <a href="/Cliente/Registro" >Crear Cuenta</a>
                </>
              )
            }
          </div>
        </div>
      </div> 

      <div className='row'>
          <div className='col'>
              {/* Main navbar */}
              <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
                  <div className="container">
                  <Link className="navbar-brand d-flex align-items-center" to="/">
                      <img src="https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/logoHSNReduced.svg" alt="HSN" style={{ width:115,height: 40, marginRight: 8 }} />
                  </Link>

                  <form className="d-none d-lg-flex flex-grow-1 mx-3">
                      <div className="input-group w-100">
                      <input type="search" className="form-control" placeholder="Buscar por: Producto, Objetivo, Ingrediente..." aria-label="Buscar" />
                      <button className="btn btn-outline-secondary" type="submit">Buscar</button>
                      </div>
                  </form>

                  <div className="d-flex align-items-center">
                      <Link to="/Pedido/PedidoActual" className="text-muted me-2 position-relative">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart-fill" viewBox="0 0 16 16">
                          <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 5H14.5a.5.5 0 0 1 .491.592l-1.5 6A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L1.01 1.607 1 1.5H.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                      </svg>
                      {/* ... mostrar cantidad de items en el carrito, NO VALE LA LONGITUD DEL ARRAY!!! pq depende de la cantidad de producto por item ...*/}
                      <span className="badge bg-danger rounded-pill position-absolute hsn-cart-badge">{pedido.itemsPedido.length}</span>
                      </Link>
                  </div>
                  </div>
              </nav>
          </div>
      </div>

      <div className='row'>
        <div className='col'>
          {/* Categories navbar */}
          <div>
            <div className="container">
              <ul id="catsppales" className="nav d-flex align-items-center overflow-auto" style={{ whiteSpace: 'nowrap' }}>
                {/* {loading && (
                  <li className="nav-item px-3 py-2 text-muted">Cargando categorías...</li>
                )}

                {error || categorias.length === 0 && (
                  <li className="nav-item px-3 py-2 text-danger">Error cargando categorías</li>
                )} */}

                {/* {!loading && !error && categorias.length > 0 && categorias.map((categoria,pos) => ( */}
                { categorias.length > 0 && categorias.map((categoria,pos) => (
                  <li
                    className="nav-item"
                    key={pos}
                    onMouseEnter={() => handleEnterParent(categoria)}
                    onMouseLeave={() => handleLeaveAll()}
                  >
                    <Link className={`nav-link px-3 ${activeParent === categoria.pathCategoria ? 'active' : ''}`} to={`/Productos/${encodeURIComponent(categoria.pathCategoria)}`}>
                      <span className="catsppales">{categoria.nombreCategoria} <i className='fas fa-chevron-down'></i></span>   
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mega panel: aparece bajo la barra de categorias */}
      { showPanel && subcats.length > 0 && (
        <>
          <div className='heading2'>Selecciona Categoria</div>
          <div className='menucontainer'
              onMouseEnter={handleEnterPanel}
              onMouseLeave={handleLeavePanel}
        >          
          <ul>
            {
              subcats.map(
                            (subcat,pos) => <li key={pos} className='first-lvl'>
                                              <Link to={`/Productos/${encodeURIComponent(subcat.pathCategoria)}`}>{subcat.nombreCategoria}</Link>
                                              {
                                                subcat.subcategorias.length > 0 && (
                                                <ul>
                                                  {subcat.subcategorias.map((tercat, tercpos) => (
                                                    <li key={tercpos} style={{borderBottom:'none', font:'normal 10px "Roboto","Open Sans",sans-serif', color:'#666'}}>
                                                      <Link to={`/Productos/${encodeURIComponent(tercat.pathCategoria)}`}>{tercat.nombreCategoria}</Link>
                                                    </li>
                                                  ))}
                                                </ul>                                                  
                                                )
                                              }
                                          </li>
                          )
            }
          </ul>
          </div>
        </>

      )}

    </div>
  );
};

export default Header;
