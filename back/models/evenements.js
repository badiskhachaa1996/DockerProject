// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    nom: { type: String },
    type: { type: String },
    date_creation: { type: Date },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    description: { type: String },
    list_inscrit: { type: [mongoose.Schema.Types.ObjectId], ref: "user", default: [] },
    date_lieu: { type: Date }
});

//Creation de la table ecole et export du model Ecole
const Evenement = mongoose.model("evenenements", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Evenement };
