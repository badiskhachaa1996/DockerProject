
//déclaration de la bibliothèque mongoose
const mongoose = require("mongoose");
// création du schéma de la table etudiant 
const etudiantSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    classe_id: { type: mongoose.Schema.Types.ObjectId, ref: "classe", required: false, default: null },
    statut: { type: String, default: 'Etudiant' },
    nationalite: { type: String },
    date_naissance: { type: Date, required: true },
    code_partenaire: { type: String },
    hasBeenBought: { type: Boolean, default: false },
    examenBought: { type: mongoose.Schema.Types.ObjectId, ref: "examen" },
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
    isHandicaped: { type: Boolean, default: false },
    suivi_handicaped: { type: String, default: null },
    diplome: { type: String, required: false }, //Formation souhaitée pour les reinscrits
    parcours: { type: mongoose.Schema.Types.Mixed, required: false }, // diplome: String, date: Date
    remarque: { type: String },
    isOnStage: { type: Boolean, default: false },
    fileRight: {
        type: mongoose.Schema.Types.Mixed, required: false,
        default: []
    },
    payment_reinscrit: {
        type: String
    },
    isActive: { type: Boolean, default: true },
    enic_naric: { type: Boolean, default: false },
    campus: { type: mongoose.Schema.Types.ObjectId, ref: "campus" },
    statut_dossier: { type: [String], default: [] },
    filiere: { type: mongoose.Schema.Types.ObjectId, ref: "diplome" },
    absencesModules: { type: mongoose.Schema.Types.Mixed, default: {} },
    date_dernier_modif_dossier: { type: Date, default: null },
    valided_by_admin: { type: Boolean, default: false },
    valided_by_support: { type: Boolean, default: false },
    annee_scolaire: { type: [String], default: ["2021-2022"] },
    date_telechargement_bulletin: { type: Date },
    conseiller: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    pays_origine: { type: String },
    etat_contract: { type: String },
    entreprise: { String },

    etat_paiement: { String },
    source: { type: String, default: 'Aucune' },
    date_valided_by_support: { type: Date },
    ecole_id: { type: mongoose.Schema.Types.ObjectId, ref: "ecole", default: '6253f5fd322d2ce51dadafbe' },//ESTYA PAR DEFAUT
    lien_livret: { type: mongoose.Schema.Types.Mixed, default: { 'read': "", 'edit': "" } },
    lien_dossier_professionel: { type: String, default: null },
    lien_tableau_synthese: { type: String, default: null },
    date_inscription: { type: Date, default: Date.now() },
    lien_bulletin: { type: mongoose.Schema.Types.Mixed, default: { 'Semestre 1': "", 'Semestre 2': "", 'Annuel': "" } },
    lien_attestation: { type: String, default: null },
    certificat_scolarite: { type: String, default: null },
    //Stage :
    nom_tuteur: { String },
    prenom_tuteur: { String },
    adresse_entreprise: { String },
    adresse_mail_tuteur: { String },
    phone_tuteur: { String },
    remarque_stage: { String }
});

//création de la table Etudiant à l'aide de la biblio mongoose
const Etudiant = mongoose.model('etudiant', etudiantSchema);
//Export du model Etudiant dans d'autres composants
module.exports = { Etudiant };
