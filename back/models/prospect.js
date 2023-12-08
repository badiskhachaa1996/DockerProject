const mongoose = require("mongoose");
const prospect_schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "user", required: true,
    },
    date_naissance: {
        type: Date,
    },
    numero_whatsapp: {
        type: String,
    },
    validated_academic_level: {
        type: String,
    },
    statut_actuel: {
        type: String,
    },
    other: {
        type: String,
    },
    languages: {
        type: String,
    },
    professional_experience: {
        type: String,
    },
    campus_choix_1: { type: String, required: false },
    campus_choix_2: { type: String, required: false },
    campus_choix_3: { type: String, required: false },

    programme: {
        type: String,
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
        type: Date
    },
    type_form: { type: String, required: false },
    code_commercial: { type: String, required: false },
    statut_dossier: { type: String, default: "En attente de traitement" },
    date_traitement: { type: Date },
    etat_dossier: { type: String, default: "En attente" },
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
        default: "Etape 1"
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
        default: "Nouveau"
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
        type: [],
        default: []
    },
    modalite: {
        type: String,
        default: "Inconnu"
    },
    documents_dossier: {
        type: [{ date: Date, nom: String, path: String, _id: { type: mongoose.Schema.Types.ObjectId, auto: true } }],
        default: [
            { nom: "CV", path: null, date: null },
            { nom: "Lettre de Motivation", path: null, date: null },
            {
                nom: "Pièce d'identité", path: null, date: null, info: `- Passeport pour les étudiant qui résident en dehors la France.
            - Carte de séjours pour les internationaux qui résident en France.
            - CNI Pour les étudiants de nationalité française.` },
            {
                nom: "Dernier diplôme obtenu", path: null, date: null, info: `Si vous avez plus qu'un diplôme merci de les joindre ensemble sur le même fichier`
            },
            {
                nom: "Relevés de note de deux dernières année", path: null, date: null, info: `Merci de les joindre ensemble sur le même fichier`
            },
            {
                nom: "Test de niveau en Français - TCF ou DELF", path: null, date: null,
                info: `Obligatoire pour les pays non francophones.
Un niveau B1 ou plus.`
            },
            { nom: "Carte vitale ou attestation provisoire", path: null, date: null }
        ]
    },
    documents_autre: {
        type: [{ date: Date, nom: String, path: String }],
        default: [
        ]
    }, avancement_cf: {
        type: String,
        default: "Non"
    },
    date_orientation: {
        type: Date,
    },
    date_admission: {
        type: Date,
    },
    date_cf: {
        type: Date,
    },
    date_visa: {
        type: Date,
    },
    date_inscription_def: {
        type: Date,
    },
    lead_type: { type: String, default: 'Ancien' },
    ville_adresse: {
        type: String,
        required: false
    },
    rue_adresse: {
        type: String,
        required: false
    },
    numero_adresse: {
        type: String,
        required: false
    },
    evaluation: [{ name: String, Score: String, duree: Number, date_envoi: Date, date_passage: Date }],
    entretien: {
        date_entretien: {
            type: Date,
            default: Date.now
        }, Duree: {
            type: Number,
            default: 0
        }, niveau: {
            type: String
        },
        parcours: {
            type: String
        },
        choix: {
            type: String
        }
    },
    decision: {
        decision_admission: {
            type: String,
            default: "En attente de traitement" // Valeur par défaut pour decision_admission
        },
        expliquation: {
            type: String,
            default: "En attente de traitement" // Valeur par défaut pour expliquation
        },
        date_decision: {
            type: Date,
            default: Date.now // Valeur par défaut pour date_decision (utilisation de la date actuelle par défaut)
        },
        membre: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }]
    },
    teams: {
        type: String,
        default: "NON"
    },
    Ypareo: {
        type: String,
        default: "NON"
    },
    groupe: {
        type: String,
        default: "NON"
    },
    payement_programme: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    ecole: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ecoleadmissions",
    },
    sos_lastname: { type: String },
    sos_firstname: { type: String },
    sos_email: { type: String },
    sos_phone: { type: String },
    evaluations: {
        type: [{
            evaluation_id: { type: mongoose.Schema.Types.ObjectId, ref: "evaluation" },
            score: { type: Number, default: 0 },
            date_passation: { type: Date },
            duree_mise: { type: Number, default: 30 },
            date_envoie: { type: Date },
            etat: { type: String, default: 'Disponible' },
            date_expiration: { type: Date },
            commentaire: { type: String },
        }],
        default: []
    }
});

const Prospect = mongoose.model("prospect", prospect_schema);
module.exports = { Prospect }; 