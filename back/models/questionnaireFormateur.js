const mongoose = require("mongoose");
const rb_sch = new mongoose.Schema({
    matiere: {
        type: String,
    },
    annee_formation: { type: String },
    contrat_travail: { type: String },
    eleve: {
        type: Number
    },
    enseignant: {
        type: Number,
    },
    pedagogie: {
        type: Number
    },
    direction: {
        type: Number,
    },
    mesure_accueil: {
        type: Number,
    },
    explication_mesure: {
        type: String,
    },
    tutorat: {
        type: Boolean,
    },
    gere: {
        type: String,
    },
    salle_visio: {
        type: Number,
    },
    disposition: {
        type: Number,
    },
    satisfait_locaux: {
        type: Number,
    },
    satisfait_site: {
        type: Number
    },
    satisfait_rythme: {
        type: Number
    },
    propositions: { type: String },
    satisfait_global: { type: Number },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    date_creation: { type: Date, default: Date.now() }
})

const QF = mongoose.model("QF", rb_sch);
module.exports = { QF }; 