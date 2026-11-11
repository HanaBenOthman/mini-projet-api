
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Inscription mtaa utilisateur jdid
const register = async (req, res) => {
  try {
    const { nom, login, password } = req.body;

    // tverifi les champs
    if (!nom || !login || !password) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires"
      });
    }

    // tverifi ken el login mawjoud wala lee
    const existingUser = await User.findOne({ login });

    if (existingUser) {
      return res.status(409).json({
        message: "Ce login est deja utilise"
      });
    }

    // Hacher mdp
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creer l'utilisateur
    const user = await User.create({
      nom,
      login,
      password: hashedPassword,
      role: "user"
    });

    // tretourni el reponse manghir mdp
    return res.status(201).json({
      message: "Utilisateur cree avec succes",
      user: {
        id: user._id,
        nom: user.nom,
        login: user.login,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erreur lors de l'inscription"
    });
  }
};

module.exports = { register };
