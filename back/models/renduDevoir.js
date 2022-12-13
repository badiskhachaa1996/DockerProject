// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    description: { type: String },
    devoir_id: { type: mongoose.Schema.Types.ObjectId, ref: "devoir" },
    etudiant_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    date_rendu: { type: Date },
    haveFiles: { type: Number, default: 0 },
    verified: { type: Boolean, default: false }
});

//Creation de la table ecole et export du model Ecole
const renduDevoir = mongoose.model("renduDevoir", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { renduDevoir };
