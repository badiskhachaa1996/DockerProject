/**
 * Le controlleur qui gère les requêtes de cet objet est skillsController.js
 */
// importation de la bibliothèque mongoose
const mongoose = require('mongoose');

// création du schema de données de la table des profils
const profileSchema = mongoose.Schema({
    libelle: { type: String, required: true, unique: true },
});

const Profile = mongoose.model("profiles", profileSchema);
module.exports = { Profile };