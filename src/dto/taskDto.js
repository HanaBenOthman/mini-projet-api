
const { z } = require("zod");

// DTO mtaa creation tache
// t7aded les donnees eli utilisateur ynajem yab3athhom
const createTaskDto = z.object({

  // Titre obligatoire w maykounch feragh
  titre: z.string().trim().min(1, "Le titre est obligatoire"),

  // Description facultative
  description: z.string().optional(),

  // Statut lezem ykoun todo, doing wala done
  statut: z.enum(["todo", "doing", "done"]).optional(),

  // Deadline facultative, ama lezem tkoun date s7i7a
  deadline: z.iso.datetime({ offset: true }).optional(),

  // Identifiant mtaa projet obligatoire
  projet: z.string().regex(
    /^[a-fA-F0-9]{24}$/,
    "Identifiant du projet invalide"
  )

}).strict();

// DTO mtaa modification tache
// Najmou nbaddlou champ wa7ed wala akther
const updateTaskDto = createTaskDto.partial();

// nexportiw les DTO bech nestaamlouhom fil controllers
module.exports = {
  createTaskDto,
  updateTaskDto
};
