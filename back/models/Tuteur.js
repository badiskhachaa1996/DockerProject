//importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table diplome
const tuteurSch = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    entreprise_id: { type: mongoose.Schema.Types.ObjectId, ref: "entreprise" },
    fonction: { type: String },
    anciennete: { type: String },
    niveau_formation: { type: String }
});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const Tuteur = mongoose.model("tuteur", tuteurSch);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Tuteur };
