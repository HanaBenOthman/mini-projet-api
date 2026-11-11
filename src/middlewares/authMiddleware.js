
const jwt = require("jsonwebtoken");

// tverifie ken l'utilisateur  est authentifie
const protect = (req, res, next) => {
  try {
    // djib el token mn les headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token manquant"
      });
    }
    //Ta3mel extraction lel token JWT men Authorization header.
    const token = authHeader.split(" ")[1];

    // tverifi  el validite mtaa token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // testocki les informations mtaa l'utilisateur
    req.user = decoded;

    // autorizi el suite de  requete
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token invalide ou expire"
    });
  }
};



// tverifi l'utilisateur kenou manager 
const managerOnly = (req, res, next) => {
  // tverifier el role de l'utilisateur authentifie
  if (!req.user || req.user.role !== "manager") {
    return res.status(403).json({
      message: "Acces reserve au manager"
    });
  }

  // Autoriser l'acces
  next();
};

module.exports = { protect, managerOnly };