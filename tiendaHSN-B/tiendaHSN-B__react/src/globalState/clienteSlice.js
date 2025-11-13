export default function clienteSlice(set,get,store){
    return {
        cliente: null, //JSON.parse( localStorage.getItem('cliente') ) || null,
        accessToken: null, //JSON.parse( localStorage.getItem('accessToken') ) || null,
        refreshToken: null, //JSON.parse( localStorage.getItem('refreshToken') ) || null,
        setCliente: (nuevoDatoCliente)=>{
            //actualizar la propiedad "cliente" del state global, y en el localStorage q usamos de backup por si hay recarga de pagina
            set ( state => ({ ...state, cliente: { ...state.cliente, ...nuevoDatoCliente} }) );
            //localStorage.setItem('cliente', JSON.stringify( { ...get().cliente, ...nuevoDatoCliente} ) );
        },
        setAccessToken: (newAccessToken)=> { 
            set(state => ({ ...state, accessToken: newAccessToken }) ); 
            //localStorage.setItem('accessToken', JSON.stringify(newAccessToken)); 
        },
        setRefreshToken: (newRefreshToken)=> { 
            set(state => ({ ...state, refreshToken: newRefreshToken }) ); 
            //localStorage.setItem('refreshToken', JSON.stringify(newRefreshToken));
        },
 }
}