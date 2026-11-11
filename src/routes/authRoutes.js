
const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const { protect, managerOnly } = require("../middlewares/authMiddleware");

// Route lel inscription mtaa el utilisateur
router.post("/register", register);

// Route pour connecter l utilisateur
router.post("/login", login);

// Route ken lel utilisateur eli connecter 
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Utilisateur authentifie",
    user: req.user
  });
});

// Route lel manager
router.get("/manager", protect, managerOnly, (req, res) => {
  res.status(200).json({
    message: "Bienvenue manager"
  });
});
module.exports = router;
