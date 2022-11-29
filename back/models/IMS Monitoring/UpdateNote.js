//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
const { Note } = require('../note');
//création du schéma de données de la table note
const noteSchema = mongoose.Schema({
    note_id: { type: mongoose.Schema.Types.ObjectId, ref: 'note', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    old_note: { type: String },
    new_note: { type: String },
    date_creation: { type: Date, required: true }
});

//Création de la table note via le schema de données
const UpdateNote = mongoose.model('monitor_UpdateNote', noteSchema);
//Export du model Examen
module.exports = { UpdateNote };