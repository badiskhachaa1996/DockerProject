//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du shema de données de la table matiere
const matiereSchema = mongoose.Schema({
    winner_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    cv_id: { type: mongoose.Schema.Types.ObjectId, ref: "cv_type" },
    company_email: { type: String },
    meeting_start_date: { type: Date },
    date_creation: { type: Date, default: Date.now },
    description: { type: String },
    statut: { type: String, default: "En cours" }
});

//creation de la table matiere
const MeetingTeams = mongoose.model('meetingTeams', matiereSchema);
//export du model matiere
module.exports = { MeetingTeams };