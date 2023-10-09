// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    nom: { type: String, },
    niveau: { type: String, },
    rncp: { type: String, },
    certificateur: { type: String, },
    duree: { type: String, },
    description: { type: String, },
    criteres: { type: String, },
    tarif: { type: String, },
    langue: { type: [String], default: [] },
    deroulement: { type: String, },
    filiere: { type: String, },
    bac: { type: String },
    code: { type: String },
    annee: { type: String },
    code_france_competence : { type: String },
    validite: { type: String },
    organisme_referent: { type: String },
    note: { type: String },
    rentree:[{
        campus: String,
        annee_scolaire: String,
        date_debut: Date,
        date_fin: Date,
        nb_heures: String,
        rythme: String,
        calendrier: String,
        examens: String,
    }], 
});

//Creation de la table ecole et export du model Ecole
const FormationAdmission = mongoose.model("formationAdmission", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { FormationAdmission };
