//déclaration de la biblio mongoose pour l'utiliser c'est comme un import
const mongoose = require("mongoose");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
const schema = new mongoose.Schema({
    level: { type: String },
    country: { type: mongoose.Schema.Types.Mixed },
    district: { type: mongoose.Schema.Types.Mixed },
    city: { type: mongoose.Schema.Types.Mixed },
    contractType: { type: String },
    curriculum: { type: String },
    domain: { type: String },
    availabilityDate: { type: String },
    studentType: { type: String },
    isActive: { type: Boolean },
    createdBy: { type: mongoose.Schema.Types.Mixed },
    _class: { type: String },
    duration: { type: String },
    description: { type: String },
    attachment: { type: mongoose.Schema.Types.Mixed },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String }
});
//creation de la table avec le nom Sujet ( model/classe) à l'aide de la biblio mongoose et son schema
const SN_student = mongoose.model("student", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { SN_student };