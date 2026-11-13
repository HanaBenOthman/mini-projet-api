
const express = require("express");

// Création  router Express bech norganisiw les routes
const router = express.Router();

// Njibou les fonctions eli ktebnehom fi projectController
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject
} = require("../controllers/projectController");
// Njibou les middlewares mtaa authentification w roles

const {
  protect,
  managerOnly
} = require("../middlewares/authMiddleware");

// creation mtaa projet jdid 
router.post("/", protect, createProject);

//  trecuperi el liste des projets aala haseb kol utilisateur chnnwa inajm ichouf
router.get("/", protect, getProjects);
//  utilisateur ynajem ymodifi ken projet mteou
router.put("/:id", protect, updateProject);

//  utilisateur ynajem yfaskh ken projet mteou
router.delete("/:id", protect, deleteProject);
// Exportation du routeur
module.exports = router;
