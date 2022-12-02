// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    libelle: { type: String },
    description: { type: String },
    groupe_id: { type: mongoose.Schema.Types.ObjectId, ref: "classe" },
    formateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    date_rendu: { type: Date },
    date_debut: { type: Date },
    haveFiles: { type: Number, default: 0 }
});

//Creation de la table ecole et export du model Ecole
const Devoir = mongoose.model("devoir", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Devoir };
