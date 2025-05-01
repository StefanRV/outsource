import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoginModal from "./LoginForm";

const PrivateRouteWithLoginModal = ({ requiredRoles = ["user", "admin"], onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowLogin(true);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (requiredRoles.includes(decoded.role)) {
        setIsAuthorized(true);
      } else {
        setShowLogin(true);
      }
    } catch (e) {
      setShowLogin(true);
    } finally {
      setLoading(false);
    }
  }, [requiredRoles]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isAuthorized ? (
        <Outlet /> 
      ) : (
        <LoginModal
          show={showLogin}
          handleClose={() => setShowLogin(false)}
          onLogin={onLogin}
        />
      )}
    </>
  );
};

export default PrivateRouteWithLoginModal;
