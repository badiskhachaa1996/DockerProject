const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    nom: { type: String },
    description: { type: String },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'brand', required: false },
    date_creation: { type: Date, default: Date.now() },
    haveFile: { type: Boolean, default: false }
});
//creation de la table avec le nom Classe ( model/classe) à l'aide de la biblio mongoose et son schema
const SupportMarketing = mongoose.model("supportMarketing", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { SupportMarketing };