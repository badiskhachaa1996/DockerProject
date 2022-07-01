//déclaration de la bibliothèque mongoose
const mongoose = require("mongoose");
// création du schéma de la table etudiant 
const etudiantSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    classe_id: { type: mongoose.Schema.Types.ObjectId, ref: "Classe", required: true },
    statut: { type: String, required: true },
    nationalite: { type: String },
    date_naissance: { type: Date, required: true },
    code_partenaire: { type: String},
    hasBeenBought: { type: Boolean, default: false },
    examenBought: { type: mongoose.Schema.Types.ObjectId, ref: "Examen" },
    howMuchBought: { type: Number },
    custom_id: { type: String },
    numero_INE: { type: String },
    numero_NIR: { type: String },
    sos_email: { type: String },
    sos_phone: { type: String },
    nom_rl: { type: String },
    prenom_rl: { type: String },
    phone_rl: { type: String },
    email_rl: { type: String },
    adresse_rl: { type: String },
    dernier_diplome: { type: String },
    isAlternant: { type: Boolean, default: false },
    // entreprise_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Entrepise', default: null, required: false },
    
    nom_tuteur: { type: String, default: null },
    prenom_tuteur: { type: String, default: null },
    adresse_tuteur: { type: String, default: null },
    email_tuteur: { type: String, default: null },
    phone_tuteur: { type: String, default: null },
    indicatif_tuteur: { type: String, default: null },
    isHandicaped: { type: Boolean, default: false },
    suivi_handicaped: { type: String, default: null },
    entreprise: { type: String, required: false }
});

//création de la table Etudiant à l'aide de la biblio mongoose
const Etudiant = mongoose.model('etudiant', etudiantSchema);
//Export du model Etudiant dans d'autres composants
module.exports = { Etudiant };