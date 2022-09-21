//déclaration de la biblio mongoose pour l'utiliser c'est comme un import
const mongoose = require("mongoose");
const { SN_mission } = require("./SN_mission");
const { SN_student } = require("./SN_student");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
const schema = new mongoose.Schema({
    student: { type: SN_student },
    mission: { type: SN_mission },
    score: { type: Number },
    comments: { type: [], default: [] },
    isActive: { type: boolean },
    createdBy: { type: mongoose.Schema.Types.Mixed },
    _class: { type: String },
});
//creation de la table avec le nom Sujet ( model/classe) à l'aide de la biblio mongoose et son schema
const SN_student = mongoose.model("student", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { SN_student };