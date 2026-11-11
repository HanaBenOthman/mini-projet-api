
const mongoose = require("mongoose");

// creation du schema mta3 utilisateur
const userSchema = new mongoose.Schema(
  {
    // Esm el utilisateur
    nom: {
      type: String,
      required: true,
      trim: true
    },

    // Login lezem ykoun unique
    login: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    // Mot de passe lezem ykoun obligatoire
    password: {
      type: String,
      required: true,
      select: false
    },

    // Role besh ikoun ya user ya manager
    role: {
      type: String,
      enum: ["user", "manager"],
      default: "user"
    }
  },
  {
    // Houni Mongoose yzid createdAt w updatedAt automatiquement
    timestamps: true
  }
);

// creation mtaa el modele user mn schema 
const User = mongoose.model("User", userSchema);

//l'exporation mtaa el modele 
module.exports = User;
