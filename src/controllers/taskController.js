
const Task = require("../models/task");
const Project = require("../models/Project");
const User = require("../models/User");
const { createTaskDto,updateTaskDto, assignTaskDto } = require("../dto/taskDto");

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


const updateTask = async (req, res) => {
  try {
    // yjib l identifiant mtaa tache mel URL
    const { id } = req.params;

    // ylawj aal tache fi MongoDB
    const task = await Task.findById(id);

    // Ken tache mch mawjoudha, yreturni erreur 
    if (!task) {
      return res.status(404).json({
        message: "Tache introuvable"
      });
    }

    // ylawj aal projet elli marbouta bih tache
    const project = await Project.findById(task.projet);

    // Ken projet mch mawjoud, yreturni erreur 
    if (!project) {
      return res.status(404).json({
        message: "Projet associe introuvable"
      });
    }

    // tverifi elli utilisateur howa proprietaire mtaa projet
    const isOwner =
      project.proprietaire.toString() === req.user.id;

    // Ken mch proprietaire, el tache matemodifich
    if (!isOwner) {
      return res.status(403).json({
        message: "Seul le proprietaire du projet peut modifier cette tache"
      });
    }

    // tverifi les nouvelles donnees bel DTO
    const result = updateTaskDto.safeParse(req.body);

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

    // Ken utilisateur ybaddel projet, tverifi el projet jdid
    if (projet !== undefined) {
      const newProject = await Project.findById(projet);

      if (!newProject) {
        return res.status(404).json({
          message: "Nouveau projet introuvable"
        });
      }

      // Maynajjemch yna9el tache l projet mch mteou
      if (newProject.proprietaire.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Vous ne pouvez pas deplacer la tache vers ce projet"
        });
      }

      task.projet = projet;
    }

    // tbadl ken les champs eli utilisateur b3athhom
    if (titre !== undefined) task.titre = titre;
    if (description !== undefined) task.description = description;
    if (statut !== undefined) task.statut = statut;
    if (deadline !== undefined) task.deadline = deadline;

    // tsajl les modifications fi MongoDB
    await task.save();

    // treturni tache baad modification
    return res.status(200).json({
      message: "Tache modifiee avec succes",
      task
    });

  } catch (error) {
    // Ken identifiant wala donnees mch s7a7
    if (
      error.name === "CastError" ||
      error.name === "ValidationError"
    ) {
      return res.status(400).json({
        message: "Identifiant ou donnees invalides"
      });
    }

    // Ken tsir erreur okhra fil serveur
    return res.status(500).json({
      message: "Erreur lors de la modification de la tache"
    });
  }
};

// Fonction tfaskh tache
const deleteTask = async (req, res) => {
  try {
    // djib identifiant mtaa tache mel URL
    const { id } = req.params;

    // tlawj aal tache fi MongoDB
    const task = await Task.findById(id);

    // Ken tache mch mawjoudha, treturni message d' erreur 
    if (!task) {
      return res.status(404).json({
        message: "Tache introuvable"
      });
    }

    // tlawj aal projet eli marbouta bih tache
    const project = await Project.findById(task.projet);

    // Ken projet mch mawjoud, treturni message d'erreur 
    if (!project) {
      return res.status(404).json({
        message: "Projet associe introuvable"
      });
    }

    // tverifiw eli utilisateur howa proprietaire mtaa projet
    const isOwner =
      project.proprietaire.toString() === req.user.id;

    // Ken mch proprietaire, tache matetfasakhch
    if (!isOwner) {
      return res.status(403).json({
        message: "Seul le proprietaire du projet peut supprimer cette tache"
      });
    }

    // Nfaskhou tache men MongoDB
    await task.deleteOne();

    // Narja3ou message elli suppression najhet
    return res.status(200).json({
      message: "Tache supprimee avec succes"
    });

  } catch (error) {
    // Ken identifiant mtaa tache mch s7i7
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Identifiant de la tache invalide"
      });
    }

    // Ken tsir erreur okhra fil serveur
    return res.status(500).json({
      message: "Erreur lors de la suppression de la tache"
    });
  }
};


// Fonction bech manager yassigni tache l utilisateur
const assignTask = async (req, res) => {
  try {
    // tverifi eli l'utilisateur connecte howa manager
    if (req.user.role !== "manager") {
      return res.status(403).json({
        message: "Acces reserve au manager"
      });
    }

    // djib identifiant mtaa tache mel URL
    const { id } = req.params;

    // tverifi les donnees bel DTO
    const result = assignTaskDto.safeParse(req.body);

    // Ken les donnees mch s7a7, treturni message d'eerur
    if (!result.success) {
      return res.status(400).json({
        message: "Donnees d'affectation invalides",
        errors: result.error.issues.map((issue) => ({
          champ: issue.path.join("."),
          message: issue.message
        }))
      });
    }

    // djib l'identifiant mtaa l'utilisateur eli bech nassigniwlou tache
    const { utilisateurAssigne } = result.data;

    // ylawj aal tache fi MongoDB
    const task = await Task.findById(id);

    // Ken tache mch mawjoudha, yreturni message d'erreur
    if (!task) {
      return res.status(404).json({
        message: "Tache introuvable"
      });
    }

    // tlawj aal l'utilisateur eli bech nassigniwlou tache
    const user = await User.findById(utilisateurAssigne);

    // Ken utilisateur mch mawjoud, treturni message d'erreur
    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }

    // tassigni tache lel utilisateur
    task.utilisateurAssigne = user._id;

    // tsajl el modification fi MongoDB
    await task.save();

    // tarja3 tache baad l'affectation
    return res.status(200).json({
      message: "Tache affectee avec succes",
      task
    });

  } catch (error) {
    // Ken identifiant mtaa tache mch s7i7 message d'erreur 
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Identifiant de la tache invalide"
      });
    }

    // Ken tsir erreur okhra fil serveur
    return res.status(500).json({
      message: "Erreur lors de l'affectation de la tache"
    });
  }
};


// exportation mtaa  les fonction mtaa tache
module.exports = { createTask, getTasks, updateTask, deleteTask,  assignTask };