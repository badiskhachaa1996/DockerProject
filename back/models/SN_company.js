//déclaration de la biblio mongoose pour l'utiliser c'est comme un import
const mongoose = require("mongoose");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
const schema = new mongoose.Schema({
    label: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    description: { type: String },
    link: { type: String },
    email: { type: String },
    isActive: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.Mixed },
    _class: { type: String },
    type: { type: String },
    ape: { type: String },
    city: { type: mongoose.Schema.Types.Mixed },
    codePostal: { type: String },
    country: { type:  mongoose.Schema.Types.Mixed },
    district: { type:  mongoose.Schema.Types.Mixed },
    legalStatus: { type: String },
    siret: { type: String },
});
//creation de la table avec le nom Sujet ( model/classe) à l'aide de la biblio mongoose et son schema
const SN_company = mongoose.model("company", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { SN_company };