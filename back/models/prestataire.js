//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du schema de données de la table prestataire
const prestataireSchema = mongoose.Schema({
    r_sociale: { type: String, required: true },
    nda: { type: String, required: false },
    vip: { type: String, required: false },
    type_ent: { type: String, required: false },
    type_soc: { type: String, required: false },
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
    website: { type: String, required: false }
});

//Création de la table entreprise via le schema de la table
const Prestataire = mongoose.model('prestataire', prestataireSchema);
//Export du model Entreprise
module.exports = { Prestataire };