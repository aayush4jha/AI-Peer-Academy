const express = require("express");
const app = express();

// Import routes
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const { cloudinaryConnect } = require("./config/cloudinary");
// const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for using postman
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

const User = require("./models/User.js");
app.use("/api/admin/*", async (req, res,next) => {
  const { googleId } = req.body;

  if (!googleId) {
    console.log("in")
    const user = await User.findOne({ googleId });

    if (!user) {
      return next()
    }

  }

  res.json({ status: 400, message: "Not an authorized user" })
})

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp",
//   })
// );
//cloudinary connection
// cloudinaryConnect();

//routes
app.use("/api", courseRoutes); // Course-related routes
app.use("/api/users", userRoutes); // User-related routes
app.use("/api/admin", adminRoutes); // Admin-related routes
app.use("/api/auth", authRoutes); // Auth-related routes
app.use("/api/payment", paymentRoutes);

//def route

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
