//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Creation du schema de la table ressource
const ressourceSchema = mongoose.Schema({
    edt: { type: Blob, required: true }
});

//creation de la table ressource et export du model Ressource
module.exports = mongoose.model("Ressource", ressourceSchema);