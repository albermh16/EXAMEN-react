import './App.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Layout from './componentes/zonaTienda/LayOut/Layout'
import Login from './componentes/zonaCliente/LoginComponent/Login'
import Registro from './componentes/zonaCliente/RegistroComponet/Registro.jsx'
import Home from './componentes/zonaTienda/Inicio/Home.jsx'
import ProductosCat from './componentes/zonaTienda/Productos/ProductosCat.jsx'
import PedidoComp from './componentes/zonaTienda/Pedido/PedidoComp.jsx'
import FinPedido from './componentes/zonaTienda/FinalizarPedido/FinPedidoComp/FinPedido.jsx';
import FinPedidoOk from './componentes/zonaTienda/FinalizarPedido/FinPedidoOKTrasPago/FinPedidoOk.jsx';
import MiCuenta from './componentes/zonaCliente/CuentaPanel/MiCuenta.jsx'
import MisDatos from './componentes/zonaCliente/CuentaPanel/1_MisDatosPersonales/MisDatos.jsx'
import LibretaDirecciones from './componentes/zonaCliente/CuentaPanel/2_LibretaDirecciones/LibretaDirecciones.jsx'
//configuramos el modulo de enrutamiento de react, react-router-dom: se encarga de detectar un cambio en la URL del navegador y
//mostrar el componente asociado a esa URL. Para hacer esto son dos pasos básicos:

//1 paso): usando metodo createBrowserRouter() creamos un objeto router que contiene las rutas de la aplicación; son objetos ROUTE con 
//propoiedades especificas como son: path (ruta URL), element (componente a renderizar en esa ruta), children (rutas hijas de la ruta actual),...

//2 paso): usando el componente <RouterProvider> (que se importa de react-router-dom) y pasandole como prop el objeto router creado en el
// primer paso, para activarlo

const rutasAplicacion=createBrowserRouter(
  [
    {
      element:<Layout/>,
      children:[
        { path:'/', element:<Home />},
        { path:'Cliente',
          children:[
            { path:'Login', element:<Login />},
            { path:'Registro', element:<Registro /> },
            { path: 'Cuenta', 
             element: <MiCuenta />,
              children:[
                { path: 'misDatosPersonales', element: <MisDatos /> },
                { path: 'LibretaDeDirecciones', element: <LibretaDirecciones /> },
              ] 
            }            
           ] 
          },
        { path:'Productos/:pathCategoria', 
          element:<ProductosCat />, 
          loader: async ( { params } ) =>{
            //funcion LOADER que se ejecuta antes de cargar el componente ProductosCat.jsx  para cargar los productos de la categoria indicada en la URL
            console.log(`ejecutando LOADER antes de la carga del componente ProductosCat.jsx, variables params=${JSON.stringify(params)}`);
            let petProductos= await fetch(`http://localhost:3000/api/Tienda/Productos?pathCat=${params.pathCategoria}`);
            let bodyRespuesta= await petProductos.json();
            return bodyRespuesta.productos;
          }
        },
        { path:'Pedido',  
          children:[
            { path:'PedidoActual', element:<PedidoComp /> },
            { path:'FinalizarPedido', element:<FinPedido /> },
            { path:'FinPedidoOK', element:<FinPedidoOk /> }
          ]
        },
        { path:'*', element: <div><img src="/images/error404.png" alt="404 Not Found" /></div>}
      ],
      loader: async ( { request, params } ) =>{
        //funcion LOADER que se ejecuta antes de cargar el LAYOUT, puede ser util para cargar CATEGORIAS PRINCIPALES en el HEADER
        console.log(`ejecutando LOADER antes de la carga del LAYOUT, variables request=${request} y params=${params}`);
        let petCategorias= await fetch('http://localhost:3000/api/Tienda/Categorias?pathCat=principales');
        let bodyRespuesta= await petCategorias.json();
        return bodyRespuesta.categorias;
      }
    },
  ]
);

function App() {
  return (
    <>
      <RouterProvider router={rutasAplicacion} />
    </>
  )
}

export default App
