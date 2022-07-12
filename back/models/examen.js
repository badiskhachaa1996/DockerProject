//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//création du schéma de données de la table examen
const examenSchema = mongoose.Schema({
    classe_id: { type: mongoose.Schema.Types.ObjectId, ref:'classe', required: true },
    matiere_id: { type: mongoose.Schema.Types.ObjectId, ref:'matiere', required: true },
    formateur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'formateur', required: true },
    date: { type: String, required: true },
    type: { type: String, required: true },
    note_max: { type: String, required: true },
    coef: { type: String, required: true },
    libelle: { type: String, required: true },
});

//Création de la table examen via le schema de données
const Examen = mongoose.model('examen', examenSchema);
//Export du model Examen
module.exports = { Examen };