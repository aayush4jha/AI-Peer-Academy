const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

// Google OAuth Client to verify the token
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Function to verify Google token and create user if necessary
const verifyGoogleTokenAndCreateUser = async (token) => {
  try {
    // Verify the token using Google OAuth client
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Extract the user info from the token payload
    const { name, email, picture, sub: googleId } = ticket.getPayload();

    // Check if the user already exists in the database
    let user = await User.findOne({ googleId });

    if (!user) {
      // If the user doesn't exist, create a new one
      user = new User({
        googleId,
        name,
        email,
        picture,
      });
      await user.save();
    }

    // Generate JWT token with the user's ID and subscription status
    const jwtToken = jwt.sign(
      { userId: user._id, isSubscribed: user.isSubscribed },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return user details and the generated JWT token
    return { user, jwtToken };
  } catch (error) {
    console.error("Error verifying Google token:", error.message);
    throw new Error("Google token verification failed");
  }
};

module.exports = { verifyGoogleTokenAndCreateUser };
