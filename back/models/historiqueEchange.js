//importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table diplome
const Schema = mongoose.Schema({
    name: { type: String },
    agent_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    detail: { type: String },
    date_creation:{type:Date,default:new Date()}
});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const historiqueEchange = mongoose.model("historiqueEchange", Schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { historiqueEchange };
