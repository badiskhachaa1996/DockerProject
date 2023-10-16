const mongoose = require('mongoose');

const annonceSchema = mongoose.Schema({
    is_interne: { type: Boolean, required: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    missionType: { type: String, required: false },
    debut: { type: Date, required: false },
    missionName: { type: String, required: false },
    missionDesc: { type: String, required: false },
    entreprise_id: { type: mongoose.Schema.Types.ObjectId, ref: 'entreprise', required: false },
    entreprise_name: { type: String, required: false },
    entreprise_ville: { type: String, required: false },
    entreprise_mail: { type: String, required: false },
    entreprise_phone_indicatif: { type: String, required: false },
    entreprise_phone: { type: String, required: false },
    profil: { type: mongoose.Schema.Types.ObjectId, ref: 'profiles', required: false },
    competences: { type: [mongoose.Schema.Types.ObjectId], ref: 'competences', required: false },
    outils: { type: [String], required: false },
    workplaceType: { type: String, required: false },
    publicationDate: { type: Date, required: false },
    source: { type: String, required: false },
    isClosed: { type: Boolean, required: false },
    custom_id: { type: String, required: false, default: 'OSA50655' },
    date_creation: { type: Date, required: false },
    statut: { type: String, default:'Active' },
    modified_at: { type: Date, required: false },
});

const Annonce = mongoose.model('annonce', annonceSchema);
module.exports = { Annonce };