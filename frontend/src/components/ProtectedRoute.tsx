import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = (): JSX.Element => {
  const authToken = localStorage.getItem("authToken");

  return <>{authToken ? <Outlet /> : <Navigate to="/login" replace />}</>;
};
