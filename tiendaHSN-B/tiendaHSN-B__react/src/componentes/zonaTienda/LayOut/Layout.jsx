import { Outlet } from 'react-router-dom';
//el componente <Outlet> es un componente especial de REACT-ROUTER-DOM que actua como marcador de posicion para incrustar
//los componentes hijos que el MODULO DE ENRUTAMIENTO detecta en la URL del navegador
import Header from './Header/Header';
import Footer from './Footer/Footer';

function Layout() {
      return (
        <div className="container-fluid">
            <div className='row'>
                <div className='col'>
                    <Header />
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <Outlet />
                </div>
            </div>

            <div className='row'>
                <div className='col'>
                    <Footer />
                </div>
            </div>

        </div>
        );
}   
export default Layout;