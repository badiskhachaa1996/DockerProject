const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    custom_id: {
        type: String
    },
    nom: {
        type: String
    },
    description: {
        type: String
    },
    date_creation: {
        type: Date
    },
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const TeamsInt = mongoose.model("teamsInt", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { TeamsInt };