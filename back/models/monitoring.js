//importation de la bibliothèque mongoose
const mongoose = require('mongoose');
const { Etudiant } = require('./etudiant');
//creation du schema de la table diplome
const sch = mongoose.Schema({
    agent_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    etudiant_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    date: { type: Date },
    etudiant_before: { type: mongoose.Schema.Types.Mixed },
    etudiant_after: { type: mongoose.Schema.Types.Mixed },
    remarque: { type: String }

});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const MonitoringEtudiant = mongoose.model("monitoring_etudiant", sch);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { MonitoringEtudiant };
