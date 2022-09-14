const mongoose = require("mongoose");
const classe_schema = new mongoose.Schema({
    diplome_id: { type: mongoose.SchemaTypes.ObjectId, ref: "diplome", required: true },
    campus_id: { type: mongoose.SchemaTypes.ObjectId, ref: "campus", required: true },
    nom: { type: String, required: true },
    active: { type: Boolean, required: true },
    abbrv: { type: String, required: true },
    annee: { type: String }
});
//creation de la table avec le nom Classe ( model/classe) à l'aide de la biblio mongoose et son schema
const Classe = mongoose.model("classe", classe_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Classe };