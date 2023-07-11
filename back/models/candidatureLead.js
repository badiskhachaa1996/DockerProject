const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    nom: { type: String },
    prenom: { type: String },
    date_naissance: { type: Date },
    nationalite: { type: String },
    phone: { type: String },
    email: { type: String },
    adresse: { type: String },
    lead_id: { type: mongoose.Schema.Types.ObjectId, ref: 'prospect', required: true },
    isPMR: { type: Boolean, default: false },
    PMRneedHelp: { type: Boolean, default: false },
    qualites: { type: String },
    toWorkOn: { type: String },
    skills: { type: String },
    parcours: { type: String },
    experiences: { type: String },
    courtterme3: { type: String },
    courtterme5: { type: String },
    courtterme10: { type: String },
    formation: { type: String },
    campus: { type: String },
    rentrée_scolaire: { type: String },
    niveau: { type: String, default: "Intermédiaire" },
    suivicours: { type: Boolean, default: false },
    acceptRythme: { type: Boolean, default: false },
    besoins: { type: String },
    motivations: { type: Number, default: 2 },
    attentes: { type: String },
    niveau_actuel: { type: Number, default: 2 },
    competences_digitales: { type: Number, default: 2 },
    competences_teams: { type: Number, default: 2 },
    competences_solo: { type: Number, default: 2 },
    signature: { type: String },
    date_creation: { type: Date, default: Date.now() }
});
//creation de la table avec le nom Classe ( model/classe) à l'aide de la biblio mongoose et son schema
const CandidatureLead = mongoose.model("candidatureLead", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { CandidatureLead };