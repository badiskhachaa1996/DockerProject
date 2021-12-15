//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du schema de données de la table formateur
const formateurSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    statut: { type: String, required: true },
    type_contrat: { type: String, required: true },
    taux_h: { type: Number, required: true },
    taux_j: { type: Number, required: true },
    isInterne: { type: Boolean, required: true },
    prestataire_id: { type: String, required: false },
    volume_h: { type: mongoose.Schema.Types.Mixed, required: false },
    volume_h_consomme: { type: mongoose.Schema.Types.Mixed, required: false }
});

//Création de la table formateur via le schema de données
const Formateur = mongoose.model('formateur', formateurSchema);
//Export du model Formateur
module.exports = { Formateur };