import axios from "axios";

export const authenticateWithGoogle = async (token) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
      token
    });
    // console.log(response, token);
    return response;
  } catch (error) {
    throw new Error("Error authenticating with Google: " + error.message);
  }
};
