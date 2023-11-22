// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    date: { type: Date },
    type: { type: String },
    note: { type: String },
    campus: { type: String },
    name: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    personal: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
});

//Creation de la table ecole et export du model Ecole
const EventCalendarRH = mongoose.model("eventCalendarRH", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { EventCalendarRH };
