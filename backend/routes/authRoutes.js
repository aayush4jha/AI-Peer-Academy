const express = require("express");
const { googleAuth } = require("../controllers/authController");

const router = express.Router();

router.get("/google", (req, res) => {
    res.json({ success: true, message: "Google OAuth route is working!" });
});

// POST route for Google login
router.post("/google", googleAuth);

module.exports = router;
