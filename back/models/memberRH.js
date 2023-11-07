const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'user'
    },
    team_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'teamsRh'
    },
    role: {
        type: String
    }
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const MemberRH = mongoose.model("memberRH", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { MemberRH };