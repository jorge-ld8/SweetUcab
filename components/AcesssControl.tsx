import { ReactElement} from "react";
import UserProfile from "../pages/userSession";
import { ReactSession} from 'react-client-session';

type AccessProps = {
    userPermissions: string[],
    allowedPermissions: string[],
    children: ReactElement,
    mode: string
}

// component to control access to elements in the app
const AccessControl:React.FC<AccessProps> =  ({userPermissions, 
                                  allowedPermissions,
                                  children, mode})=>{
                                                        

    let calcAllowedPermissionsALL: (a: string[], b: string[])=>boolean;

    calcAllowedPermissionsALL = function(allowedP: string[], userP: string[]){
        loop1:for(let permission of allowedP){
            for(let permission2 of userP){
                if(permission == permission2)
                    break loop1;
            }
            return false
        }
        return true
    }
    

    function calcAllowedPermissionsONE(allowedP, userP){
        for(let permission of userP){
            for(let permission2 of allowedP){
                if(permission == permission2){
                    return true;
                }
            }
        }
        return false
    }
    if((mode==="all" && 
    calcAllowedPermissionsALL(allowedPermissions, userPermissions)) ||
       (mode==="one" && calcAllowedPermissionsONE(allowedPermissions, userPermissions))) 
        return children 
    else 
        return null
}

export default AccessControl;