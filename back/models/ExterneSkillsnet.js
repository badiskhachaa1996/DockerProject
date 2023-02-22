
//déclaration de la bibliothèque mongoose
const mongoose = require("mongoose");
// création du schéma de la table etudiant 
const schema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
});

//création de la table Etudiant à l'aide de la biblio mongoose
const ExterneSkillsnet = mongoose.model('externeSkillsnet', schema);
//Export du model Etudiant dans d'autres composants
module.exports = { ExterneSkillsnet };
