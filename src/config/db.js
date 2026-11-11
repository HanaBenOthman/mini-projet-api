//importation mtaa mongoose
const mongoose = require("mongoose");

// connexion maa MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Ken connexion najhet, n'affichiw message
    console.log("MongoDB connecte avec succes !");
  } catch (error) {
    // Ken fama erreur, n'affichiwha w nwa9fou serveur
    console.error("Erreur MongoDB :", error.message);
    process.exit(1);
  }
};
// exporation mtaa el fonction 
module.exports = connectDB;
