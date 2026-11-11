
const express = require("express");
const router = express.Router();

const { register } = require("../controllers/authController");

// Route lel inscription mtaa el utilisateur
router.post("/register", register);

module.exports = router;
