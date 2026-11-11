
const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");

// Route lel inscription mtaa el utilisateur
router.post("/register", register);

// Route pour connecter l utilisateur
router.post("/login", login);
module.exports = router;
