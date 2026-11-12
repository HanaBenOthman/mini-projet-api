
//imporation mtaa les modules 
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
// Houni na9raw les variables mel fichier .env
dotenv.config();

// creation mtaa l'application 
const app = express();

// tkhali el serveur yarkra les donnees bl formats JSON
app.use(express.json());
//tkoull l express eli les routes d'authentification  yebdew b /api/auth
app.use("/api/auth", authRoutes);
// les routes mtaa projets 
app.use("/api/projects", projectRoutes);
//les routes mtaa tasks
app.use("/api/tasks", taskRoutes);

// creation mta3 route GET bech njarbou serveur
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API REST fonctionne !"
  });
});
// 7adadet el port eli bech yekhdem 3lih serveur
const PORT = process.env.PORT || 3000;

// connectina el serveur m3aa MongoDB 
const startServer = async () => {
  await connectDB();
// demarrit el serveur 
  app.listen(PORT, () => {
    console.log(`Serveur demarre sur http://localhost:${PORT}`);
  });
};

startServer();








