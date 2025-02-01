const { verifyGoogleTokenAndCreateUser } = require("../services/authService");

// Controller function to handle Google login
const googleAuth = async (req, res) => {
  const { token } = req.body; // Token sent by the frontend

  try {
    // Verify the token and create the user if necessary
    const { user, jwtToken } = await verifyGoogleTokenAndCreateUser(token);
    console.log(user, jwtToken);
    // Respond with user data and JWT token
    res.status(200).json({
      user: {
        googleId: user.googleId,
        name: user.name,
        email: user.email,
        picture: user.picture,
        isSubscribed: user.isSubscribed,
        isAdmin: user.isAdmin,
      },
      token: jwtToken,
    });
    // debugging
    console.log(user);
  } catch (error) {
    console.error("Error in Google login:", error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { googleAuth };
