// Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
// Création du schema de données de la table entreprise
const entrepriseSchema = mongoose.Schema({
    r_sociale: { type: String, required: true },
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
    civilite_rep: { type: String, required: false },
    nom_rep: { type: String, required: false },
    prenom_rep: { type: String, required: false },
    email_rep: { type: String, required: false },
    indicatif_rep: { type: Number, required: false },
    phone_rep: { type: Number, required: false },
    indicatif_rep_wt: { type: Number, required: false },
    phone_rep_wt: { type: Number, required: false },
    isTuteur: { type: Boolean, required: false },
    civilite_tuteur: { type: String, required: false },
    nom_tuteur: { type: String, required: false },
    prenom_tuteur: { type: String, required: false },
    email_tuteur: { type: String, required: false },
    indicatif_tuteur: { type: Number, required: false },
    phone_tuteur: { type: Number, required: false },
    indicatif_tuteur_wt: { type: Number, required: false },
    phone_tuteur_wt: { type: Number, required: false },
    date_naissance_tuteur: { type: String, required: false },
    fonction_tuteur: { type: String, required: false },
    anciennete_tuteur : { type: Number, required: false },
    niveau_etude_tuteur: { type: String, required: false },
    Directeur_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },



});

//Création de la table entreprise via le schema de la table
const Entreprise = mongoose.model('entreprise', entrepriseSchema);
//Export du model Entreprise
module.exports = { Entreprise };