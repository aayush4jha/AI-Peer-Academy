const mongoose = require("mongoose");

// Define the schema for the user model
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String },
  isSubscribed: { type: Boolean, default: false }, // Subscription status
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
