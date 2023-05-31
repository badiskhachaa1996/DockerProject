const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'user'
    },
    team_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'teamsCRM'
    },
    localisation: {
        type: String,
        default: "France - Paris"
    },
    role: {
        type: String
    },
    custom_id: {
        type: String
    },
    date_creation: {
        type: Date,
        required: true,
        default: Date.now
    },
    numero_whatapp: {
        type: String
    },
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const MemberCRM = mongoose.model("memberCRM", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { MemberCRM };