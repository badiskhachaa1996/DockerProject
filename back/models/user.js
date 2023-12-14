//déclaration de la biblio mongoose pour l'utiliser c'est comme un import
const mongoose = require("mongoose");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
const user_schema = new mongoose.Schema({
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    indicatif: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false,
        sparse: true,
        unique: true
    },
    email_perso: {
        type: String,
        required: false
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "user",
        required: false
    },
    etat: {
        type: Boolean,
        default: false
    },
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "service",
        required: false
    },
    civilite: {
        type: String,
        default: null
    },
    pathImageProfil: {
        type: String,
    },
    typeImageProfil: {
        type: String
    },
    type: {
        type: String,
        required: false,
        default: 'Externe-InProgress'
    },
    entreprise: {
        type: String,
        required: false
    },
    pays_adresse: {
        type: String,
        required: false
    },
    ville_adresse: {
        type: String,
        required: false
    },
    rue_adresse: {
        type: String,
        required: false
    },
    numero_adresse: {
        type: String,
        required: false
    },
    postal_adresse: {
        type: String,
        required: false
    },
    IsWhatsApp: {
        type: Boolean,
        required: false
    },
    nationnalite: {
        type: String,
        required: false
    },
    verifedEmail: {
        type: Boolean,
        required: false,
        default: true
    },
    date_creation: { type: Date, required: false, default: Date.now },
    departement: { type: String },
    last_connection: { type: Date, default: new Date() },
    mention: { //not used
        type: String,
        required: false,
    },
    equipe_id: { type: mongoose.Schema.Types.ObjectId, ref: "team" },
    campus: { type: mongoose.Schema.Types.ObjectId, ref: "campus" },
    roles_list: {
        type: [{
            module: { type: String },
            role: { type: String },
        }], default: []
    },
    service_list: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "service" }], default: []
    },
    statut: { type: String, required: false },
    sujet_list: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "sujet" }], default: []
    },
    roles_ticketing_list: {
        type: [{
            module: { type: mongoose.Schema.Types.ObjectId, ref: "service" },
            role: { type: String },
        }], default: []
    },
    documents_rh: {
        type: [{
            date: { type: Date },
            filename: { type: String },
            path: { type: String },
            note: { type: String },
        }], default: []
    },
    savedTicket: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "ticket" }], default: []
    },
    savedAnnonces: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "annonce" }], default: []
    },
    savedMatching: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "cv_type" }], default: []
    },
    linksnames: [{ type: String }],
    haveNewAccess: { type: Boolean, default: false },
    type_supp: { type: [String], default: [] }
    ,
    savedAdministration: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "prospect" }], default: []
    },
    savedLeadCRM: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "leadCRM" }], default: []
    },
    savedProject: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "projects" }], default: []
    }


});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const User = mongoose.model("user", user_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { User };