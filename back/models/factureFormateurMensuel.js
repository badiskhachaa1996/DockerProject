//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du shema de données de la table matiere
const sch = mongoose.Schema({
    date_creation: { type: Date },
    formateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    mois: { type: String, required: true }
});

//creation de la table matiere
const FactureFormateurMensuel = mongoose.model('factureFormateurMensuel', sch);
//export du model matiere
module.exports = { FactureFormateurMensuel };