// Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
// Création du schema de données de la table entreprise
const entrepriseSchema = mongoose.Schema({
    r_sociale: { type: String, required: true, unique: true },
    fm_juridique: { type: String, required: false },
    activite: { type: String, required: false },
    type_ent: { type: String, required: false },
    categorie: { type: [String], required: false },
    isInterne: { type: Boolean, required: false },
    crc: { type: String, required: false },
    nb_salarie: { type: Number, required: false },
    convention: { type: String, required: false },
    idcc: { type: String, required: false },
    indicatif_ent: { type: Number, required: false },
    phone_ent: { type: Number, required: false },
    adresse_ent: { type: String, required: false },
    code_postale_ent: { type: Number, required: false },
    ville_ent: { type: String, required: false },
    adresse_ec: { type: String, required: false },
    postal_ec: { type: Number, required: false },
    ville_ec: { type: String, required: false },
    siret: { type: Number, required: false },
    code_ape_naf: { type: String, required: false },
    num_tva: { type: Number, required: false },
    telecopie: { type: String, required: false },
    OPCO: { type: String, required: false },
    organisme_prevoyance: { type: String, required: false },
    
    directeur_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

//Création de la table entreprise via le schema de la table
const Entreprise = mongoose.model('entreprise', entrepriseSchema);
//Export du model Entreprise
module.exports = { Entreprise };