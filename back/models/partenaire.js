//déclaration de la bibliothèque mongoose
const mongoose = require("mongoose");
// création du schéma de la table etudiant 
const sch = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    code_partenaire: {type: String},
    nom: {type: String},
    phone: {type: String},
    email: {type: String},
    number_TVA: {type: String},
    SIREN: {type: String},
    SIRET: {type: String},
    format_juridique: {type: String},
    APE: {type: String},
    Services: {type: String},
    Pays: {type: String},
    type: {type: String},
    WhatsApp: {type: String},
    indicatifPhone: {type: String},
    indicatifWhatsApp:{type: String}
    
});

//création de la table Etudiant à l'aide de la biblio mongoose
const Partenaire = mongoose.model('partenaire', sch);
//Export du model Etudiant dans d'autres composants
module.exports = { Partenaire };