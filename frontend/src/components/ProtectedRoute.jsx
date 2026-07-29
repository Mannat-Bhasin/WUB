import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import usePinStore from "../store/usePinStore";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const pinsLoaded = usePinStore((state) => state.pinsLoaded);
  const fetchPins = usePinStore((state) => state.fetchPins);

  useEffect(() => {
    if (token && !pinsLoaded) {
      fetchPins();
    }
  }, [token, pinsLoaded, fetchPins]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;