//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du shema de données de la table matiere
const sch = mongoose.Schema({
    date_creation: { type: Date },
    nom: { type: String },
    prenom : { type: String },
    email : { type: String },
    phone : { type: String },
    parcours : { type: String },
    situation : { type: String },
    pays : { type: String },
    remarque : { type: String }
});

//creation de la table matiere
const ProspectIntuns = mongoose.model('prospectIntuns', sch);
//export du model matiere
module.exports = { ProspectIntuns };