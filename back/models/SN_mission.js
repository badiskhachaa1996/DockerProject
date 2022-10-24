//déclaration de la biblio mongoose pour l'utiliser c'est comme un import
const mongoose = require("mongoose");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
const schema = new mongoose.Schema({
    title: { type: String },
    specialty: { type: String },
    function: { type: String },
    typeRemuneration: { type: String },
    remuneration: { type: Number },
    duration: { type: String },
    yearExperience: { type: String },
    startDate: { type: String },
    isActive: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.Mixed },
    _class: { type: String },
    description: { type: String },
    city: { type: mongoose.Schema.Types.Mixed },
    country: { type:  mongoose.Schema.Types.Mixed },
    district: { type:  mongoose.Schema.Types.Mixed },
    attachment: { type:  mongoose.Schema.Types.Mixed },
});
//creation de la table avec le nom Sujet ( model/classe) à l'aide de la biblio mongoose et son schema
const SN_mission = mongoose.model("mission", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { SN_mission };