const mongoose = require("mongoose");
const prospect_schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    date_naissance: {
        type: Date,
        required: false,
    },
    numero_whatsapp: {
        type: String,
        required: false,
    },
    validated_academic_level: {
        type: String,
        required: false,
    },
    statut_actuel: {
        type: String,
        required: false,
    },
    other: {
        type: String,
        required: false,
    },
    languages: {
        type: String,
        required: false,
    },
    professional_experience: {
        type: String,
        required: false,
    },
    campus_choix_1: { type: String, required: false },
    campus_choix_2: { type: String, required: false },
    campus_choix_3: { type: String, required: false },

    programme: {
        type: String,
        required: false,
    },
    formation: {
        type: String,
        required: false,
    },
    rythme_formation: {
        type: String,
        required: false,
    },
    servicesEh: {
        type: [Boolean],
        required: false,
    },
    nomGarant: {
        type: String,
        required: false,
    },
    prenomGarant: {
        type: String,
        required: false,
    },
    nomAgence: {
        type: String,
        required: false,
    },
    donneePerso: {
        type: Boolean,
        required: false,
    },
    date_creation: {
        type: Date,
        required: false,
    },
    type_form: { type: String, required: false },
    code_commercial: { type: String, required: false },
    statut_dossier: { type: String, required: false, default: "En attente de traitement" },
    date_traitement: { type: Date },
    etat_dossier: { type: String, required: false, default: "En cours de traitement" },
    tcf: { type: String },
    agent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    indicatif_whatsapp: {
        type: String,
        required: false,
    },
    decision_admission: {
        type: String,
        required: false,
        default: "Aucun"
    },
    statut_payement: {
        type: String,
        required: false,
        default: "Aucun"
    },
    phase_complementaire: {
        type: String,
        required: false,
        default: "Aucun"
    },
    customid: {
        type: String,
        required: false,
    },
    nbDoc: {
        type: Number,
        default: 0
    },
    traited_by: {
        type: String,
        default: "Aucun"
    },
    archived: {
        type: Boolean,
        default: false
    },
    validated_cf: {
        type: Boolean,
        default: false
    },
    payement: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    avancement_visa: {
        type: Boolean
    },
    etat_traitement: {
        type: String,
        default: "Nouvelle"
    }
});

const Prospect = mongoose.model("prospect", prospect_schema);
module.exports = { Prospect }; 