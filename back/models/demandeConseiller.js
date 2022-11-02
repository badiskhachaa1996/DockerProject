//declaration de la bibliothèque mongodb
const mongoose = require("mongoose");
//creation du schema de table demande_event
const demande_conseiller = mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    conseiller_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    archived: { type: Boolean, default: false },
    activated: { type: Boolean, default: false }
});

//creation de la table  à l'aide de la biblio mongoose et son schema
const Demande_conseiller = mongoose.model("demande_conseiller", demande_conseiller);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Demande_conseiller };