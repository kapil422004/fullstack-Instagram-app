import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const { authUser } = useSelector((store) => store.users);
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, []);

  return <>{children}</>;
};

export default ProtectedRoutes;
