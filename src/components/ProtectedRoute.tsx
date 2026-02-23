import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: any) => {
  const { isAuthReady, isAuthenticated } = useSelector(
    (state: any) => state.auth,
  );

  if (!isAuthReady) return null; 

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return children;
};

export default ProtectedRoute;
