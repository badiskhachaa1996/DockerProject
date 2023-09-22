//déclaration de la biblio mongoose pour l'utiliser c'est comme un import
const mongoose = require("mongoose");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
const schema = new mongoose.Schema({
    offre_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "annonce"
    },
    candidat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
    ,
    entreprise_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "entreprise"
    },
    statut: { type: String },
    note: { type: String }
});
//creation de la table avec le nom Sujet ( model/classe) à l'aide de la biblio mongoose et son schema
const SuiviCandidat = mongoose.model("suiviCandidat", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { SuiviCandidat };