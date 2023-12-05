//déclaration de la bibliothèque mongoose
const mongoose = require("mongoose");
// création du schéma de la table etudiant 
const sch = mongoose.Schema({
   
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: false },
    code_partenaire: { type: String },
    nom: { type: String },
    phone: { type: String },
    email: { type: String },

    number_TVA: { type: String },
    SIREN: { type: String },
    SIRET: { type: String },
    format_juridique: { type: String },
    type: { type: String },
    APE: { type: String },
    Services: { type: String },

    Pays: { type: String },
    WhatsApp: { type: String },
    indicatifPhone: { type: String },
    indicatifWhatsapp: { type: String },
    site_web: { type: String },
    facebook: { type: String },
    description: { type: String },
    date_creation: { type: Date },
    statut_anciennete: { type: String, default: "Ancien > 1 an" },
    contribution: { type: String, default: "Inactif" },
    etat_contrat: { type: String, default: "Non" },

    pathImageProfil: { type: String },
    typeImageProfil: { type: String },
    commissions: { type: [{ description: String, montant: String }], default: [] },
    pathEtatContrat: { type: String },
    typeEtatContrat: { type: String },

    typePartenaire: { type: String },
    groupeWhatsApp: { type: String },
    localisation: { type: String },
    manage_by: { type: mongoose.Schema.Types.ObjectId, ref: "memberInt" },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    ville_ent:{ type: String },
    code_postale_ent:{ type: String},
    adresse_ent:{ type: String},
});

//création de la table Etudiant à l'aide de la biblio mongoose
const Partenaire = mongoose.model('partenaire', sch);
//Export du model Etudiant dans d'autres composants
module.exports = { Partenaire };