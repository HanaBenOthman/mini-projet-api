
const express = require("express");
const router = express.Router();

// Njibou middleware bech n7amiw les routes bel JWT
const { protect } = require("../middlewares/authMiddleware");

// Njibou fonction creation mtaa tache
const { createTask,getTasks } = require("../controllers/taskController");

// Route bech utilisateur connecte ynajem yaamel tache jdida
router.post("/", protect, createTask);

// Route bech utilisateur connecte ychouf les taches
router.get("/", protect, getTasks);
// Nsaddrou les routes mtaa taches
module.exports = router;
