//importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table diplome
const schema = mongoose.Schema({
    prenom: { type: String },
    nom: { type: String },
    date_naissance: { type: Date },
    pays_naissance: { type: String },
    nationalite: { type: String },
    email: { type: String },
    phone: { type: String },
    domaine: { type: String },
    source: { type: String },
    inscrit_etablissement: { type: Boolean, default: false },
    etablissement: { type: String },
});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const sourceForm = mongoose.model("sourceForm", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { sourceForm };
