// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const ecole_schema = new mongoose.Schema({
    libelle: { type: String, required: true },
    annee_id: { type: mongoose.Schema.Types.ObjectId, ref: "anneeScolaire", required: true },
    ville: { type: String, required: true },
    pays: { type: String, required: true },
    adresse: { type: String, required: true },
    email: { type: String, required: true },
    site: { type: String, required: true },
    telephone: { type: String, required: true },
    logo: { type: String, required: false },
    cachet: { type: String, required: false },
    pied_de_page: { type: String, required: false },
});

//Creation de la table ecole et export du model Ecole
const Ecole = mongoose.model("ecole", ecole_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Ecole };
