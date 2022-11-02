const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    createur_id: {
        type: mongoose.SchemaTypes.ObjectId, ref: "user"
    },
    owner_id: {
        type: mongoose.SchemaTypes.ObjectId, ref: "user"
    },
    team_id: {
        type: [mongoose.SchemaTypes.ObjectId], default: [], ref: "user"
    }
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const TeamCommercial = mongoose.model("teamCommercial", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { TeamCommercial };