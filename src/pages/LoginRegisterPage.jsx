import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthModal from "../components/auth/AuthModal";

export default function LoginRegisterPage({ initialMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleClose = () => {
    navigate(from, { replace: true });
  };

  return (
    <AuthModal isOpen={true} onClose={handleClose} initialMode={initialMode} />
  );
}
