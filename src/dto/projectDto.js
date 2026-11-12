
const { z } = require("zod");

// DTO mtaa creation projet
// tverifi les donnees eli utilisateur yab3athhom
const createProjectDto = z.object({
  // Esm el projet obligatoire w maykounch feragh
  nom: z.string().trim().min(1, "Le nom est obligatoire"),

  // Description facultative
  description: z.string().optional(),

  // Statut lezem ykoun men les valeurs hedhouma
  statut: z.enum(["en cours", "termine", "en pause"]).optional()
}).strict();

// DTO mtaa modification projet
// Kol champ facultatif khater najmou nbadlou champ bark
const updateProjectDto = createProjectDto.partial();

// exportation mtaa les DTO bech nestaamlouhom fil controller
module.exports = {
  createProjectDto,
  updateProjectDto
};
