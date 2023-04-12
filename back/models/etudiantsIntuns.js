// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    formation_id:{ type: mongoose.Schema.Types.ObjectId, ref: "formationIntuns", required: true },
});

//Creation de la table ecole et export du model Ecole
const EtudiantIntuns = mongoose.model("etudiantIntuns", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { EtudiantIntuns };
