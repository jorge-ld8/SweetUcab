import { ReactNode } from "react";

type AccessProps = {
    userPermissions: String[],
    allowedPermissions: String[],
    children: ReactNode,
    renderNoAccess: any
}

const AccessControl:React.FC<AccessProps> =  ({userPermissions, 
                                  allowedPermissions,
                                  children,
                                  renderNoAccess})=>{
    
    return(<div></div>);
}

export default AccessControl;