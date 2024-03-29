var UserProfile = (function() {
  let full_name = "";
  let user_id = "";
  let user_rol:string[] = [];
  let productosPresupuesto = [];
  let productosCarrito = [];
  let productosPickandmix = [];
  let getName : () => string;
  getName = function() {
    return full_name; 
  };

  function initializeProductoPresupuesto(){
    productosPresupuesto = []; 
  }
  
  function initializeProductosCarrito(){
    productosCarrito = [];
  }

    function initializeProductosPickandmix(){
      productosPickandmix = [];
    }

  function addProductoCantidad(prod, cantidad){
    productosPresupuesto.push([prod, cantidad]);
  }

  function addProductoCarrito(prod, cantidad, precio){
    productosCarrito.push([prod, cantidad, precio]);
  }

    function addProductoPickandmix(prod, cantidad, precio){
      productosPickandmix.push([prod, cantidad, precio]);
    }

  function getProductosPresupuesto(){
    return productosPresupuesto;
  }

  function getProductoCarrito(){
    return productosCarrito;
  }
    function getProductoPickandmix(){
      return productosPickandmix;
    }

  let setName: (name: string) => void;
  setName = function(name) {
    full_name = name;     
  };

  let setUser: (id: string) => void;
  setUser = function (id){
    user_id = id;
  }

  let getUser: ()=>string;
  getUser = function (){
    return user_id; 
  }

  let setRol: (rol: string[]) => void;
  setRol = function(rol){
    user_rol = [];
    for(let valor of rol)
        user_rol.push(valor);
  }

  let getRol: () => string[];

  getRol = function(){
    return user_rol;
  }
  
  let isLoggedIn: () => boolean
  isLoggedIn = function(){ return !!full_name;}

  return {
    getName: getName,
    setName: setName,
    getUser: getUser,
    setUser: setUser,
    setRol: setRol,
    getRol: getRol,
    loggedIn: isLoggedIn,
    initializeProductoPresupuesto: initializeProductoPresupuesto,
    addProductoCantidad: addProductoCantidad,
    getProductosPresupuesto: getProductosPresupuesto,
    initializeProductosCarrito: initializeProductosCarrito,
    addProductoCarrito: addProductoCarrito,
    getProductoCarrito: getProductoCarrito,
    initializeProductosPickandmix: initializeProductosPickandmix,
        addProductoPickandmix: addProductoPickandmix,
        getProductoPickandmix: getProductoPickandmix,
  }

})();

export default UserProfile;
