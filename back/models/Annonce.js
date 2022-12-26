const mongoose = require('mongoose');

const annonceSchema = mongoose.Schema({
    user_id:                    { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false }, 
    missionType:                { type: String, required: false },
    debut:                      { type: Date, required: false },
    missionName:                { type: String, required: false },
    missionDesc:                { type: String, required: false },
    entreprise_name:            { type: String, required: false },
    entreprise_ville:           { type: String, required: false },
    entreprise_mail:            { type: String, required: false },
    entreprise_phone_indicatif: { type: String, required: false },
    entreprise_phone:           { type: String, required: false },
    profil:                     { type: String, required: false },
    competences:                { type: [String], required: false },
    outils:                     { type: [String], required: false },
    workplaceType:              { type: String, required: false },
    publicationDate:            { type: Date, required: false },
    source:                     { type: String, required: false },
    isClosed:                   { type: Boolean, required: false },
});

const Annonce = mongoose.model('annonce', annonceSchema);
module.exports = { Annonce };