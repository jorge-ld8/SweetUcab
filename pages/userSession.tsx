var UserProfile = (function() {
  let full_name = "";
  let user_id = "";
  let user_rol = "";

  let getName = function() {
    return full_name; 
  };

  let setName = function(name) {
    full_name = name;     
  };

  let setUser = function (id){
    user_id = id;
  }

  let getUser = function (){
    return user_id; 
  }

  let setRol = function(rol){
    user_rol = rol;
  }

  let getRol = function(){
    return user_rol;
  }

  return {
    getName: getName,
    setName: setName,
    getUser: getUser,
    setUser: setUser,
    setRol: setRol,
    getRol: getRol
  }

})();

export default UserProfile;
