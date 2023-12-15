const mongoose = require('mongoose');

const schema = mongoose.Schema({
    source: { type: String, required: false },
    operation: { type: String, required: false },
    civilite: { type: String, required: false },
    nom: { type: String, required: false },
    prenom: { type: String, required: false },
    pays_residence: { type: String, required: false },
    email: { type: String, required: false },
    indicatif_phone: { type: String, required: false },
    numero_phone: { type: String, required: false },
    date_naissance: { type: Date, required: false },
    nationalite: { type: String, required: false },
    indicatif_whatsapp: { type: String, required: false },
    numero_whatsapp: { type: String, required: false },
    indicatif_telegram: { type: String, required: false },
    numero_telegram: { type: String, required: false },
    dernier_niveau_academique: { type: String, required: false },
    statut: { type: String, required: false },
    statut_dossier: { type: String, required: false },
    niveau_fr: { type: String, required: false },
    niveau_en: { type: String, required: false },
    date_creation: { type: Date, default: Date.now },
    custom_id: { type: String, required: false },
    //Contact
    contacts: {
        type: [{
            date_contact: { type: Date, required: false },
            contact_by: { type: String, required: false },
            canal: { type: String, required: false },
            suite_contact: { type: String, required: false },
            note: { type: String, required: false },
        }],
    },
    //Ventes
    ventes: {
        type: [{
            date_paiement: { type: Date, required: false },
            montant_paye: { type: String, required: false },
            modalite_paiement: { type: String, required: false },
            note: { type: String }
        }],
    },
    //Mailing
    mailing: {
        type: [{
            date_envoie: { type: Date, required: false },
            objet_mail: { type: String, required: false },
            note: { type: String }
        }], default: []

    },
    send_mail: { type: String, required: false }, //Surement Optionnel

    //Qualification
    produit: { type: [String], required: false, default: [] },
    criteres_qualification: { type: [String], required: false, default: [] },
    decision_qualification: { type: String, required: false, default: "Non qualifié" },
    note_qualification: { type: String, required: false },

    //Affectation
    affected_date: { type: Date, required: false },
    affected_to_member: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },

    //Choix Prospects
    rythme: { type: String, required: false },
    ecole: { type: String, required: false },
    formation: { type: String, required: false },
    campus: { type: String, required: false },
    eduhorizon: { type: String, required: false },
    note_choix: { type: String, required: false },

    //Documents
    documents: {
        type: [{
            nom: { type: String, required: false },
            path: { type: String, required: false },
        }],
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    qualifications: {
        type: [{
            criteres_qualification: { type: [String], required: false, default: [] },
            decision_qualification: { type: String, required: false, default: "Non qualifié" },
            note_qualification: { type: String, required: false },
        }]
    },
    equipe: { type: String, required: false },
});

const LeadCRM = mongoose.model('leadCRM', schema);
module.exports = { LeadCRM };