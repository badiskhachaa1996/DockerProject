//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du shema de données de la table matiere
const matiereSchema = mongoose.Schema({
    nom: { type: String, required: true },
    formation_id: { type: [mongoose.Schema.Types.ObjectId], ref: "diplome", required: true },
    volume_init: { type: Number, default: 0 },
    abbrv: { type: String, required: true },
    //classe_id: { type: mongoose.Schema.Types.ObjectId, ref: "classe", required: true },
    semestre: { type: String, default: "Semestre 1" },
    niveau: { type: String, default: "1er année" },
    //diplome_id:{type: mongoose.Schema.Types.ObjectId,ref:}
    seance_max: { type: Number, required: true, default: 1 },
    coeff: { type: Number, default: 1 },
    credit_ects: { type: Number, default: 1 },
    remarque: { type: String },
    hors_bulletin: { type: Boolean, default: false }
});

//creation de la table matiere
const Matiere = mongoose.model('matiere', matiereSchema);
//export du model matiere
module.exports = { Matiere };