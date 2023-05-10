const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    nom: { type: String },
    description: { type: String },
    partenaire_id: { type: mongoose.Schema.Types.ObjectId, ref: 'partenaire', required: false },
    haveLogo: { type: Boolean, default: false }
});
//creation de la table avec le nom Classe ( model/classe) à l'aide de la biblio mongoose et son schema
const Brand = mongoose.model("brand", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Brand };