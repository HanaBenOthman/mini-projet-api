 
const express = require("express");
const router = express.Router();

// Njibou middleware bech n7amiw les routes bel JWT
const { protect,managerOnly } = require("../middlewares/authMiddleware");

// Njibou fonction creation w affichage w modification mtaa tache
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  assignTask
} = require("../controllers/taskController");

// Route bech utilisateur connecte ynajem yaamel tache jdida
router.post("/", protect, createTask);

// Route bech utilisateur connecte ychouf les taches
router.get("/", protect, getTasks);

// Route bech utilisateur ymodifi tache mtaa projet mteou
router.put("/:id", protect, updateTask);
// Route bech nfaskhou tache mn projet
router.delete("/:id", protect, deleteTask);
// Route bech ken manager ynajem yassigni tache l utilisateur
router.put("/:id/assign", protect, managerOnly, assignTask);
// exportation mtaa les routes mtaa taches
module.exports = router;
