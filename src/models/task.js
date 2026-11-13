
const mongoose = require("mongoose");

// Schema mtaa les taches
const taskSchema = new mongoose.Schema({

 
  titre: {
    type: String,
    required: true,
    trim: true
  },

 
  description: {
    type: String,
    trim: true
  },


  statut: {
    type: String,
    enum: ["todo", "doing", "done"],
    default: "todo"
  },

  
  deadline: {
    type: Date
  },

  // Kol tache marbouta b projet
  projet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },

  
  utilisateurAssigne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }

}, {
  // Yzid automatiquement date creation w modification
  timestamps: true
});


module.exports = mongoose.model("Task", taskSchema);
