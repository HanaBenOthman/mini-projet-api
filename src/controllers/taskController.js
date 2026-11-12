
const Task = require("../models/task");
const Project = require("../models/Project");
const { createTaskDto } = require("../dto/taskDto");

// Fonction bech naamlou tache jdida
const createTask = async (req, res) => {
  try {
    // tverifi les donnees eli b3athhom utilisateur bel DTO
    const result = createTaskDto.safeParse(req.body);

    // Ken les donnees mch s7a7, treturni erreur 
    if (!result.success) {
      return res.status(400).json({
        message: "Donnees de la tache invalides",
        errors: result.error.issues.map((issue) => ({
          champ: issue.path.join("."),
          message: issue.message
        }))
      });
    }

    // tekhou ken les donnees eli tvalidaw
    const { titre, description, statut, deadline, projet } = result.data;

    // tlawj aal projet bech net2akdou eli mawjoud
    const projectExists = await Project.findById(projet);

    // Ken projet mch mawjoud, treturni erreur 
    if (!projectExists) {
      return res.status(404).json({
        message: "Projet introuvable"
      });
    }

    // Naamlou tache jdida marbouta bel projet
    const task = await Task.create({
      titre,
      description,
      statut,
      deadline,
      projet,

      // Ma nassigniw 7atta utilisateur wa9t creation
      // Khater ken el manager ynajem yaamel affectation
      utilisateurAssigne: null
    });

    // tarja3 el tache eli t3amlet
    return res.status(201).json({
      message: "Tache creee avec succes",
      task
    });

  } catch (error) {
    // Ken MongoDB tal9a donnees invalides
    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        message: "Donnees de la tache invalides"
      });
    }

    // Ken tsir mochkla okhra fil serveur
    console.error("Erreur createTask :", error);

    return res.status(500).json({
      message: "Erreur lors de la creation de la tache"
    });
  }
};

 // Fonction bech njibou liste mtaa les taches
const getTasks = async (req, res) => {
  try {
    // Ken utilisateur manager, ynajem ychouf les taches lkol
    if (req.user.role === "manager") {
      const tasks = await Task.find()
        .populate("projet", "nom statut")
        .populate("utilisateurAssigne", "nom login");

      return res.status(200).json(tasks);
    }

    // Ken utilisateur normal, nlawjou aal projets mteou
    const projects = await Project.find({
      proprietaire: req.user.id
    }).select("_id");

    // yekhou les identifiants mtaa projets mteou
    const projectIds = projects.map((project) => project._id);

    // yjib ken les taches marbouta b projets mteou
    const tasks = await Task.find({
      projet: { $in: projectIds }
    })
      .populate("projet", "nom statut")
      .populate("utilisateurAssigne", "nom login");

    // yreturni liste mtaa les taches
    return res.status(200).json(tasks);

  } catch (error) {
    // Ken tsir mochkla fil serveur
    return res.status(500).json({
      message: "Erreur lors de la recuperation des taches"
    });
  }
};

// Nexportiw fonction creation w consultation tache
module.exports = { createTask, getTasks };