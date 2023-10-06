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
    campus: { type: [String], default: []},
    annee_scolaire: { type: mongoose.Schema.Types.ObjectId, ref: "rentreeAdmission"},
    date_debut: { type: Date },
    date_fin: { type: Date },
    nb_heures: { type: String },
    rythme: { type: String }, 
    calendrier: { type: String },
    examens: { type: Date }, 
    note: { type: String },
});

//Creation de la table ecole et export du model Ecole
const FormationAdmission = mongoose.model("formationAdmission", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { FormationAdmission };
