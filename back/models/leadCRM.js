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
    niveau_fr: { type: String, required: false },
    niveau_en: { type: String, required: false },
    
    custom_id: { type: String, required: false },
    date_contact: { type: Date, required: false },
    contact_by: { type: mongoose.Schema.Types.ObjectId, ref: 'memberCRM', required: false },
    canal: { type: String, required: false },
    suite_contact: { type: String, required: false },
    note: { type: String, required: false },
    produit: { type: String, required: false },
    date_paiement: { type: Date, required: false },
    montant_paye: { type: String, required: false },
    modalite_paiement: { type: String, required: false },
    date_envoie: { type: Date, required: false },
    objet_mail: { type: String, required: false },
    send_mail: { type: String, required: false },
    decision_qualification: { type: String, required: false },
});

const LeadCRM = mongoose.model('leadCRM', schema);
module.exports = { LeadCRM };