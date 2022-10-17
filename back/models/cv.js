//importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table diplome
const sch = mongoose.Schema({
    langues: { type: [String], default: [] },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    experiences: [
        { skill: String },
        { date_debut: Date },
        { date_fin: Date }
    ],
    connaissances: [
        { skill: String },
        { niveau: Number }
    ]

});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const CV = mongoose.model("cv", sch);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { CV };
