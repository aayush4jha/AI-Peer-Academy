import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminRoute = ({ children }) => {
  const { signupData } = useSelector((state) => state.auth);

  if (signupData.isAdmin === true) return children;
  else toast.error("Not authorized to access this url");
};

export default AdminRoute;
