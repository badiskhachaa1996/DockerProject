// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    title: { type: String },
    linkedin: { type: String, default: "https://www.linkedin.com/learning/" },
    informations_custom: { type: String }
});

//Creation de la table ecole et export du model Ecole
const FormationsIntuns = mongoose.model("formationIntuns", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { FormationsIntuns };
