//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Creation du schema de la table ressource
const ressource_schema = mongoose.Schema({
    edt: { type: String, required: true },
    program : { type: String, required: true},
    calendar : { type: String, required: true},
    classe_id: { type: mongoose.Schema.Types.ObjectId, ref: "Classe", required: true },
});

//creation de la table ressource avec le nom Ressource ( model/classe) à l'aide de la biblio mongoose et son schema
const Ressource = mongoose.model("ressource", ressource_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Ressource };
