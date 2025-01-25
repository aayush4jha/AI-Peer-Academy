import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { signupData } = useSelector((state) => state.auth);
  console.log(signupData?.isAdmin);
  if (signupData.isAdmin === true) return <Navigate to="/admin/dashboard" />;
  else if (signupData !== null) return children;
  else return <Navigate to="/" />;
};

export default PrivateRoute;
