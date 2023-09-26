// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    libelle: { type: String, default: "Indisponible" },
    type: { type: String, default: "Indisponible" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    from: { type: Date },
    to: { type: Date },
});

//Creation de la table ecole et export du model Ecole
const DisponbiliteEtudiant = mongoose.model("disponbiliteEtudiant", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { DisponbiliteEtudiant };
