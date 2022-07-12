//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//création du schéma de données de la table note
const noteSchema = mongoose.Schema({
    note_val: { type: String, required: true },
    semestre: { type: String, required: true},
    etudiant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'etudiant', required: true },
    examen_id: { type: mongoose.Schema.Types.ObjectId, ref: 'examen', required: true },
    appreciation: { type: String, required: true },
    classe_id: { type: String, required: true },
    matiere_id: { type: String, required: true },
});

//Création de la table note via le schema de données
const Note = mongoose.model('noteexam', noteSchema);
//Export du model Examen
module.exports = { Note };