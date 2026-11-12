
const mongoose = require("mongoose");

//  schema mtaa projet fi MongoDB
const projectSchema = new mongoose.Schema(
  {
    
    nom: {
      type: String,
      required: true,
      trim: true
    },

    
    description: {
      type: String,
      trim: true
    },

    
    proprietaire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    
    statut: {
      type: String,
      enum: ["en cours", "termine", "en pause"],
      default: "en cours"
    }
  },
  {
    // MongoDB yzid automatiquement date creation w modification
    timestamps: true
  }
);

// Naamlou modele Project men schema
const Project = mongoose.model("Project", projectSchema);

// exportation mtaa el  modele bech nestaamlouh fi les controllers
module.exports = Project;
