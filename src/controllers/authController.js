
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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


// Connexion mtaa un utilisateur
const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    // tverifier les champs 
    if (!login || !password) {
      return res.status(400).json({
        message: "Login et mot de passe obligatoires"
      });
    }

    // tcherchi un utilisateur b motdepassou
    const user = await User.findOne({ login }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Identifiants incorrects"
      });
    }

    // tcompari el mdp maa hash mteaou 
    const passwordValide = await bcrypt.compare(password, user.password);

    if (!passwordValide) {
      return res.status(401).json({
        message: "Identifiants incorrects"
      });
    }

    // tgeneri el token jwt
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Connexion reussie",
      token,
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
      message: "Erreur lors de la connexion"
    });
  }
};

//tkhali les deux fonctions disponibles lel les routes mteana 
module.exports = { register, login };