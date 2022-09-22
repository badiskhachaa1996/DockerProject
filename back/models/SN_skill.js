//déclaration de la biblio mongoose pour l'utiliser c'est comme un import
const mongoose = require("mongoose");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
const schema = new mongoose.Schema({
    label: { type: String },
    codeRome: { type: String },
});
//creation de la table avec le nom Sujet ( model/classe) à l'aide de la biblio mongoose et son schema
const SN_skill = mongoose.model("SN_skill", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { SN_skill };