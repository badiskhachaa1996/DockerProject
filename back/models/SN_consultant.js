//déclaration de la biblio mongoose pour l'utiliser c'est comme un import
const mongoose = require("mongoose");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
const schema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    email: { type: String },
    isActive: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.Mixed },
    _class: { type: String },
    companyId: { type: String },
    description: { type: String },
    city: { type: mongoose.Schema.Types.Mixed },
    country: { type:  mongoose.Schema.Types.Mixed },
    district: { type:  mongoose.Schema.Types.Mixed },
    attachment: { type:  mongoose.Schema.Types.Mixed },
});
//creation de la table avec le nom Sujet ( model/classe) à l'aide de la biblio mongoose et son schema
const SN_consultant = mongoose.model("consultant", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { SN_consultant };