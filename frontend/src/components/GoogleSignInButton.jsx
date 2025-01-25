import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { authenticateWithGoogle } from "../services/authService";
import { useDispatch } from "react-redux";
import { setToken, setSignupData } from "../slices/authSlice.jsx"; // Import actions
import { useSelector } from "react-redux";
// import { logout } from "../slices/authSlice.jsx";

function GoogleSignInButton() {
  const dispatch = useDispatch();
  const handleLoginSuccess = async (response) => {
    const token = response.credential; // Google login token
    try {
      const response = await authenticateWithGoogle(token);
      // console.log(response);
      // console.log(response.data.token);

      // Store in localStorage
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Update Redux state
      dispatch(setToken(response.data.token));
      dispatch(setSignupData(response.data.user));
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
}

export default GoogleSignInButton;
