//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du shema de données de la table matiere
const sch = mongoose.Schema({
    date_creation: { type: Date },
    formateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    seance_id: { type: mongoose.Schema.Types.ObjectId, ref: "seance", required: true }
});

//creation de la table matiere
const FactureFormateur = mongoose.model('factureFormateur', sch);
//export du model matiere
module.exports = { FactureFormateur };