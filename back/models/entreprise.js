// Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
// Création du schema de données de la table entreprise
const entrepriseSchema = mongoose.Schema({
    r_sociale: { type: String, required: true },
    fm_juridique: { type: String, required: false },
    vip: { type: Number, required: false },
    type_ent: { type: String, required: false },
    isInterne: { type: Boolean, required: false },
    siret: { type: String, required: false },
    code_ape_naf: { type: String, required: false },
    num_tva: { type: String, required: false },
    nom_contact: { type: String, required: false },
    prenom_contact: { type: String, required: false },
    fc_contact: { type: String, required: false },
    email_contact: { type: String, required: false },
    phone_contact: { type: String, required: false },
    nom_contact_2nd: { type: String, required: false },
    prenom_contact_2nd: { type: String, required: false },
    fc_contact_2nd: { type: String, required: false },
    email_contact_2nd: { type: String, required: false },
    phone_contact_2nd: { type: String, required: false },
    pays_adresse: { type: String, required: false },
    ville_adresse: { type: String, required: false },
    rue_adresse: { type: String, required: false },
    numero_adresse: { type: Number, required: false },
    postal_adresse: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    website: { type: String, required: false },
    financeur: { type: String, required: false },
    nda: { type: String, required: false },
    type_soc: { type: String, required: false },
    categorie: { type: [String], default: [] },
    Directeur_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    activite: { type: String, required: false },
    adresse_ec: { type: String, required: false },
    postal_ec: { type: String, required: false },
    ville_ec: { type: String, required: false },
    crc: { type: String, required: false },
    convention: { type: String, required: false },
    telecopie: { type: String, required: false },
    nb_salarie: { type: String, required: false },
    idcc: { type: String, required: false },
    indicatif: { type: String, required: false },
    OPCO: { type: String, required: false },
    organisme_prevoyance: { type: String, required: false },


});

//Création de la table entreprise via le schema de la table
const Entreprise = mongoose.model('entreprise', entrepriseSchema);
//Export du model Entreprise
module.exports = { Entreprise };