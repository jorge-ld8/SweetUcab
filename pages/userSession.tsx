var UserProfile = (function() {
  let full_name = "";
  let user_id = "";
  let user_rol:string[] = [];

  let getName : () => string;
  getName = function() {
    return full_name; 
  };

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
    loggedIn: isLoggedIn
  }

})();

export default UserProfile;
