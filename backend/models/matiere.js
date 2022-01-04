//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du shema de données de la table matiere
const matiereSchema = mongoose.Schema({
    nom: { type: String, required: true},
});

//creation de la table matiere
const Matiere = mongoose.model('matiere', matiereSchema);
//export du model matiere
module.exports = { Matiere };