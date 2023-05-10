// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    custom_id: { type: String },
    prospect_id: { type: mongoose.Schema.Types.ObjectId, ref: "prospect" },
    ecole: { type: mongoose.Schema.Types.ObjectId, ref: "ecoleAdmission" },
    type: { type: String },
    date: { type: Date },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    filename: { type: String }
});

//Creation de la table ecole et export du model Ecole
const DocumentInternational = mongoose.model("documentInternational", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { DocumentInternational };
