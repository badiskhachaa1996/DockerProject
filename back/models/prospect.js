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
        default: "Initiale"
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
        default: Date.now
    },
    type_form: { type: String, required: false },
    code_commercial: { type: String, required: false },
    statut_dossier: { type: String, default: "En attente de traitement" },
    date_traitement: { type: Date },
    etat_dossier: { type: String, default: "En cours de traitement" },
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
        default: "En attente de traitement"
    },
    statut_payement: {
        type: String,
        default: "Non"
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
    traited_by: {
        type: String,
        default: "Aucun"
    },

    validated_cf: {
        type: String,
        default: false
    },
    payement: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    avancement_visa: {
        type: String,
        default: "Pas de retour"
    },
    enTraitement: {
        type: Boolean,
        default: false
    },

    etat_traitement: {
        type: String,
        default: "Nouvelle"
    },
    nir: {
        type: String,
        required: false,
    },
    mobilite_reduite: {
        type: Boolean,
        default: false
    },
    sportif_hn: {
        type: Boolean,
        default: false
    },
    horsAdmission: {
        type: Boolean,
        default: false
    },
    archived: {
        type: Boolean,
        default: false
    },
    document_manquant: {
        type: [String],
        default: []
    },
    document_present: {
        type: [String],
        default: []
    },
    remarque: {
        type: String,
        default: ""
    },
    dossier_traited_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "memberInt",
    },
    haveDoc: {
        type: Boolean,
        default: false
    },
    origin: {
        type: String,
        default: "Site Web"
    },
    source: {
        type: String,
        default: "Interne"
    },
    rentree_scolaire: {
        type: String,
        default: "Septembre 2022"
    },
    isCalled: {
        type: Boolean,
        default: false
    },
    numeroAgence: {
        type: String
    },
    languages_fr: {
        type: String
    },
    languages_en: {
        type: String
    },
    numero_telegram: {
        type: String
    },
    indicatif_telegram: {
        type: String
    },
    decision_orientation: {
        type: [String],
        default: ["En attente de contact"]
    },
    phase_candidature: {
        type: String,
        default: "En attente d'affectation"
    },
    agent_sourcing_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "memberInt",
        default: null
    },
    date_sourcing: {
        type: Date
    },
    a_besoin_visa: {
        type: String,
    },
    finance: {
        type: String,
    },
    logement: {
        type: String,
    },
    team_sourcing_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teamsInt",
        default: null
    },
    contact_date: {
        type: Date,
    },
    contact_orientation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "memberInt",
        default: null
    },
    avancement_orientation: {
        type: String,
        default: "En attente"
    },
    note_avancement: {
        type: String,
    },
    note_decision: {
        type: String,
    },
    note_dossier: {
        type: String,
    },
    note_phase: {
        type: String,
    },
    niveau_langue: {
        type: String,
    },
    dossier_traited_date: {
        type: Date
    },
    procedure_peda: {
        type: String
    },
    numero_dossier_campus_france: {
        type: String
    },
    consulaire_traited_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "memberInt",
    },
    consulaire_date: {
        type: Date,
    },
    note_dossier_cf: {
        type: String
    },
    note_consulaire: {
        type: String
    },
    documents_administrative: {
        type: [{ date: Date, nom: String, path: String, traited_by: String, note: String }],
        default: []
    },
    modalite: {
        type: String,
        default: "Inconnu"
    }
});

const Prospect = mongoose.model("prospect", prospect_schema);
module.exports = { Prospect }; 