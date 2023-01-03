/**
 * Le controlleur qui gère les requêtes de cet objet est skillsController.js
 */

// importation de la bibliothèque mongoose
const mongoose = require('mongoose');

// création du schema de données de la table des profils
const competenceSchema = mongoose.Schema({
    libelle:    { type: String, required: true, unique: true },
    profile_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
});

const Competence = mongoose.model("competences", competenceSchema);
module.exports = { Competence };