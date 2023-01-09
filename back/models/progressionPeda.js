//déclaration de la bibliothèque mongoose
const mongoose = require("mongoose");
// création du schéma de la table etudiant 
const sch = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    seance_id: { type: mongoose.Schema.Types.ObjectId, ref: "seance" },
    theme: { type: String },
    objectif: { type: String },
    methode: { type: String },
    support: { type: String },
    semestre: { type: String, default: 'Semestre 1' },
    observations: { type: String }
});

//création de la table Etudiant à l'aide de la biblio mongoose
const ProgressionPeda = mongoose.model('progressionPeda', sch);
//Export du model Etudiant dans d'autres composants
module.exports = { ProgressionPeda };