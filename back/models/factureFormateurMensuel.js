//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du shema de données de la table matiere
const sch = mongoose.Schema({
    formateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    mois: { type: String, required: true },
    date_creation: { type: Date },
    year: { type: String, default: "2023" },
    remarque: { type: String, default: "" },
    nombre_heure: { type: Number, default: 0 }
});

//creation de la table matiere
const FactureFormateurMensuel = mongoose.model('factureFormateurMensuel', sch);
//export du model matiere
module.exports = { FactureFormateurMensuel };