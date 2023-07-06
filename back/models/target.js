//importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table diplome
const schema = mongoose.Schema({
    equipe_id: { type: mongoose.Schema.Types.ObjectId, ref: "teamsCRM" },
    member_id: { type: mongoose.Schema.Types.ObjectId, ref: "memberCRM" },
    type: { type: String },
    KPI: { type: Number },
    date_commencement: { type: Date },
    deadline: { type: Date },
    description: { type: String },
    date_creation: { type: Date, default: Date.now },
    custom_id: { type: String }
});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const Target = mongoose.model("target", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Target };
