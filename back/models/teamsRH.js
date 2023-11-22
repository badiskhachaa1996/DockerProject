const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    nom: {
        type: String
    }
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const TeamsRH = mongoose.model("teamsRh", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { TeamsRH };