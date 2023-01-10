const mongoose = require("mongoose");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
const pwdToken_schema = new mongoose.Schema({
    date_creation: {
        type: Date,
        default: Date.now()
    },
    assez_informations: { type: Boolean },
    contenu: { type: Number },
    locaux: { type: Boolean },
    equipments: { type: Boolean },
    outils: { type: String },
    orga: { type: Number },
    horaires: { type: Number },
    rythme: { type: Number },
    orga: { type: Number },
    contenu: { type: Number },
    disponibilite: { type: Number },

});
//creation de la table avec le nom Service ( model/classe) à l'aide de la biblio mongoose et son schema
const QFF = mongoose.model("qff", pwdToken_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { QFF };
