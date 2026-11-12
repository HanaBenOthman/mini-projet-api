
const Project = require("../models/Project");

// Fonction bech naamlou projet jdid
const createProject = async (req, res) => {
  try {
    // tjib les donnees eli b3athhom utilisateur
    const { nom, description, statut } = req.body;

    // tverifi eli esm el projet mawjoud w s7i7
    if (typeof nom !== "string" || !nom.trim()) {
      return res.status(400).json({
        message: "Le nom du projet est obligatoire"
      });
    }

    // creation mtaa projet jdid fi MongoDB
    const project = await Project.create({
      nom: nom.trim(),
      description,
      statut,

      // El proprietaire howa utilisateur eli connecte
      proprietaire: req.user.id
    });

    // tretourni el projet cree
    return res.status(201).json({
      message: "Projet cree avec succes",
      project
    });

  } catch (error) {
    // message d'erreur 
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Donnees du projet invalides"
      });
    }

    
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

module.exports = { createProject, getProjects };
