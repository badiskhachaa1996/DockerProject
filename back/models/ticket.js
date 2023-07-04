const mongoose = require("mongoose");
const ticket_schema = new mongoose.Schema({
    createur_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "user",
        required: true
    },
    sujet_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "sujet"
    },
    date_ajout: {
        type: Date,
        required: true,
        default: Date.now()
    },
    agent_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "user",
    },
    statut: {
        type: String,
        required: true,
        default: "En attente de traitement"
    },
    date_affec_accep: {
        type: Date
    },

    date_fin_traitement: {
        type: Date,
        default: null
    },

    isAffected: {
        type: Boolean,
        default: null
    },
    description: {
        type: String,
        required: true
    },
    isReverted: {
        type: Boolean
    },
    justificatif: {
        type: String,
        default: ""
    },
    date_revert: {
        type: Date
    },
    user_revert: {
        type: String
    },
    customid: {
        type: String,
        default: "ESTYANOPEPE10120000001"
    },
    etudiant_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "etudiant"
    },

    //Documents
    documents: {
        type: [{
            nom: { type: String, required: false },
            path: { type: String, required: false },
        }], default: []
    },
    priorite: {
        type: String
    }, note: { type: String },
    documents_service: {
        type: [{
            nom: { type: String, required: false },
            path: { type: String, required: false },
        }], default: []
    },
    priorite_agent: {
        type: String,
        default: "Aucune"
    },
    note_assignation: {
        type: String,
    },
    date_limite: {
        type: Date
    }
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const Ticket = mongoose.model("ticket", ticket_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Ticket };