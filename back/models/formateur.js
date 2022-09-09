//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du schema de données de la table formateur
const formateurSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    type_contrat: { type: String, required: true },
    taux_h: { type: String, required: false },
    taux_j: { type: Number, required: false },
    prestataire_id: { type: mongoose.Schema.Types.ObjectId, ref: 'entreprise', required: false },
    volume_h: { type: mongoose.Schema.Types.Mixed, required: false },
    volume_h_consomme: { type: mongoose.Schema.Types.Mixed, required: false },
    monday_available: { type: mongoose.Schema.Types.Mixed, default: { state: false, h_debut: null, h_fin: null, remarque: "" } },
    tuesday_available: { type: mongoose.Schema.Types.Mixed, default: { state: false, h_debut: null, h_fin: null, remarque: "" } },
    wednesday_available: { type: mongoose.Schema.Types.Mixed, default: { state: false, h_debut: null, h_fin: null, remarque: "" } },
    thursday_available: { type: mongoose.Schema.Types.Mixed, default: { state: false, h_debut: null, h_fin: null, remarque: "" } },
    friday_available: { type: mongoose.Schema.Types.Mixed, default: { state: false, h_debut: null, h_fin: null, remarque: "" } },
    remarque: { type: String },
    campus_id: { type: [mongoose.Schema.Types.ObjectId], ref: 'campus', default: [] },
    nda: { type: String, required: false },
    IsJury: { type: mongoose.Schema.Types.Mixed, required: false, default: {} },
    absences: { type: [Date], default: [] }
});

//Création de la table formateur via le schema de données
const Formateur = mongoose.model('formateur', formateurSchema);
//Export du model Formateur
module.exports = { Formateur };