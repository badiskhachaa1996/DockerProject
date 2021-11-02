const mongoose = require("mongoose");
const schema= new mongoose.Schema({
    diplome: { type: mongoose.SchemaTypes.ObjectId, ref: "Diplome", required: true },
    libelle:{ type: String, required: true }
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const Classe= mongoose.model("classe",schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports={Classe};