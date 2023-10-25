const mongoose = require('mongoose');

const collaborateurSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    matricule: { type: String, required: false },
    date_demarrage: { type: Date, required: false },
    date_naissance: { type: Date, required: false },
    localisation: { type: [String], required: false, default: [] },
    intitule_poste: { type: String, required: false },
    contrat_type: { type: String, required: false },
    statut: { type: String, required: false },
    h_cra: { type: Number, required: false },
    competences: {
        type: [{
            kind: { type: String, required: false },
            level: { type: String, required: false },
        }], required: false
    },
    poste_description: { type: String, required: false },
    documents: {
        type: [{
            title: { type: String, required: false },
            note: { type: String, required: false },
            filename: { type: String, required: false },
        }], required: false
    },
    conge_nb: { type: Number, required: false, default: 0 },
    other: {
        type: [{
            title: { type: String, required: false },
            description: { type: String, required: false },
        }], default: []
    }
});

const Collaborateur = mongoose.model('collaborateur', collaborateurSchema);
module.exports = { Collaborateur };