// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const ecoleSchema = mongoose.Schema({
    libelle : { type: String, required: true }, 
    annee_id: { type: mongoose.Schema.Types.ObjectId, ref: "anneeScolaire", required: true },
    ville: { type: String, required: true },
    pays: { type: String, required: true },
    adresse: { type: String, required: true },
    email: { type: String, required: true },
    site: { type: String, required: true },
    telephone: { type: String, required: true },  
});

//Creation de la table ecole et export du model Ecole
module.exports = mongoose.model("Ecole", ecoleSchema);