const mongoose = require("mongoose");
const classe_schema = new mongoose.Schema({
    formation_id: { type: mongoose.SchemaTypes.ObjectId, ref: "formationAdmission" },
    campus_id: { type: mongoose.SchemaTypes.ObjectId, ref: "campusRework" },
    ecole_id: { type: mongoose.SchemaTypes.ObjectId, ref: "ecoleAdmission" },
    nom: { type: String },
    active: { type: Boolean, default: true },
    abbrv: { type: String },
    annee: { type: String },
    lien_programme: { type: String, default: "" },
    lien_calendrier: { type: String, default: "" },
    calendrier: { type: String, required: false },
});
//creation de la table avec le nom Classe ( model/classe) à l'aide de la biblio mongoose et son schema
const Groupe = mongoose.model("groupe", classe_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Groupe };