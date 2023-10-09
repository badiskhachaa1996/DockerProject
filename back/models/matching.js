//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du shema de données de la table matiere
const matiereSchema = mongoose.Schema({
    offre_id: { type: mongoose.Schema.Types.ObjectId, ref: "annonce", required: true },
    matcher_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    cv_id: { type: mongoose.Schema.Types.ObjectId, ref: "cv_type", required: true },
    statut: { type: String, default: "En Cours" },
    type_matching: { type: String, default: "MU" },
    date_creation: { type: Date },
    remarque: { type: String, default: "" },
    taux: { type: Number, default: 0 },
    hide: { type: Boolean, default: false },
    accepted: { type: Boolean, default: false },
});

//creation de la table matiere
const Matching = mongoose.model('matching', matiereSchema);
//export du model matiere
module.exports = { Matching };