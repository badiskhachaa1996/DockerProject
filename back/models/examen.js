//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//création du schéma de données de la table examen
const examenSchema = mongoose.Schema({
    classe_id: { type: [mongoose.Schema.Types.ObjectId], ref: 'classe' },
    matiere_id: { type: [mongoose.Schema.Types.ObjectId], ref: 'matiere', required: true },
    formateur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'formateur', required: true },
    date: { type: [Date], required: true },
    type: { type: String, required: true },
    note_max: { type: Number, required: true },
    coef: { type: Number, required: true, default: 1 },
    libelle: { type: String, required: true },
    niveau: { type: String },
    semestre: { type: String, default: "Semestre 1" },
    canEdit: { type: Boolean, default: true },
    date_fin: { type: String, required: false },
});

//Création de la table examen via le schema de données
const Examen = mongoose.model('examen', examenSchema);
//Export du model Examen
module.exports = { Examen };