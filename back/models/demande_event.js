//declaration de la bibliothèque mongodb
const mongoose = require("mongoose");
//creation du schema de table demande_event
const demande_events = mongoose.Schema({
    email: { type: String, required: true },
    nom:   { type: String, required: true },
    phone: { type: String, required: true },
    pays:  { type: String, required: true },
    domaine : { type: [String], required: true },
});

//creation de la table  à l'aide de la biblio mongoose et son schema
const Demande_events = mongoose.model("demande_events", demande_events);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Demande_events };