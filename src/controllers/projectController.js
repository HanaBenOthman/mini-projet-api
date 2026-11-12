//  DTO bech yverifi les donnees mtaa projets
const {
  createProjectDto,
  updateProjectDto
} = require("../dto/projectDto");
const Project = require("../models/Project");

// Fonction bech naamlou projet jdid

const createProject = async (req, res) => {
  try {
    // Nverifiw les donnees eli b3athhom utilisateur bel DTO
    const result = createProjectDto.safeParse(req.body);

    // Ken les donnees mch s7a7, yresturni erreur
    if (!result.success) {
      return res.status(400).json({
        message: "Donnees du projet invalides",
        errors: result.error.issues.map((issue) => ({
          champ: issue.path.join("."),
          message: issue.message
        }))
      });
    }

    // yekhou  ken les donnees eli tvalidaw bel DTO
    const { nom, description, statut } = result.data;

    //  projet jdid fi MongoDB
    const project = await Project.create({
      nom,
      description,
      statut,

      // El proprietaire howa utilisateur eli connecte
      proprietaire: req.user.id
    });

    // treturni el projet eli t3mal
    return res.status(201).json({
      message: "Projet cree avec succes",
      project
    });

  } catch (error) {
      console.log("Erreur createProject :", error);

    // Ken tsir erreur fil validation mtaa MongoDB
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Donnees du projet invalides"
      });
    }

    // Ken tsir erreur okhra fil serveur
    return res.status(500).json({
      message: "Erreur lors de la creation du projet"
    });
  }
};


// Fonction tjib liste mtaa les projets
const getProjects = async (req, res) => {
  try {
    
    let filter = {};

    // Ken utilisateur mch manager, tjib ken projets mteou
    if (req.user.role !== "manager") {
      filter = { proprietaire: req.user.id };
    }

    // trecherchi aal projets selon el filtre
    const projects = await Project.find(filter)
      .populate("proprietaire", "nom login");

    // treterni liste mtaa les projets
    return res.status(200).json(projects);
//message d'erreur
  } catch (error) {
    
    return res.status(500).json({
      message: "Erreur lors de la recuperation des projets"
    });
  }
};

// Fonction lel modification des informations mtaa projet

const updateProject = async (req, res) => {
  try {
    // djib identifiant mtaa projet mel URL
    const { id } = req.params;

    // tlawj aal projet fi MongoDB
    const project = await Project.findById(id);

    // Ken projet mch mawjoud, treturni erreur 
    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable"
      });
    }

    // tverifi eli utilisateur howa proprietaire mtaa projet
    const isOwner =
      project.proprietaire.toString() === req.user.id;

    // Ken mch proprietaire, mahouch bsh inajm imodifi
    if (!isOwner) {
      return res.status(403).json({
        message: "Seul le proprietaire peut modifier ce projet"
      });
    }

    // tverifi les nouvelles donnees bel DTO
    const result = updateProjectDto.safeParse(req.body);

    // Ken les donnees mch s7a7, treturni erreur 
    if (!result.success) {
      return res.status(400).json({
        message: "Donnees du projet invalides",
        errors: result.error.issues.map((issue) => ({
          champ: issue.path.join("."),
          message: issue.message
        }))
      });
    }

    // tekhdhou ken les champs eli tvalidaw
    const { nom, description, statut } = result.data;

    // tbadl ken les champs eli utilisateur b3athhom
    if (nom !== undefined) {
      project.nom = nom;
    }

    if (description !== undefined) {
      project.description = description;
    }

    if (statut !== undefined) {
      project.statut = statut;
    }

    // tsajl les modifications fi MongoDB
    await project.save();

    // treturni el projet baad modification
    return res.status(200).json({
      message: "Projet modifie avec succes",
      project
    });

  } catch (error) {
    // Ken identifiant mch s7i7 wala donnees MongoDB invalides
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
      message: "Erreur lors de la modification du projet"
    });
  }
};


// Fonction  tfaskh el projet
const deleteProject = async (req, res) => {
  try {
    // tjib identifiant mtaa projet mel URL
    const { id } = req.params;

    // tlawj aal projet fi MongoDB
    const project = await Project.findById(id);

    // Ken projet mch mawjoud, tajaa message d'erreur
    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable"
      });
    }

    // tverifi eli utilisateur howa proprietaire mtaa projet
    const isOwner =
      project.proprietaire.toString() === req.user.id;

    // Ken mch proprietaire, el projet mayetfasakhch
    
    if (!isOwner) {
      return res.status(403).json({
        message: "Seul le proprietaire peut supprimer ce projet"
      });
    }

    // tfaskh projet men MongoDB
    await project.deleteOne();

    // treturni message eli suppression najhet
    return res.status(200).json({
      message: "Projet supprime avec succes"
    });

  } catch (error) {
    // Ken identifiant mtaa projet mch s7i7
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Identifiant du projet invalide"
      });
    }

    // Ken tsir erreur okhra
    return res.status(500).json({
      message: "Erreur lors de la suppression du projet"
    });
  }
};


// exportation mtaa les fonctions lkol bech nestaamlouhom fil routes
module.exports = { createProject,getProjects,updateProject, deleteProject};
