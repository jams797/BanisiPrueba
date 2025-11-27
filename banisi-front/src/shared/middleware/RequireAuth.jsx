import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken, isTokenValid } from "../helpers/jwt";

function RequireAuth() {
  const location = useLocation();
  const token = getToken();

  const autorizado = isTokenValid(token);

  if (!autorizado) {
    return <Navigate to="/portal/login" replace state={{ from: location }} />;
  }

  
  return <Outlet />;
}

export default RequireAuth;
