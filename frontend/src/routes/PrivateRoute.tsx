import type { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";

interface PrivateRouteProps {
  allowedRoles: string[];
}
 
const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({allowedRoles}) => {
  return ( 
    <Outlet />
   );
}
 
export default PrivateRoute;