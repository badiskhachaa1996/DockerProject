const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    date_naissance: {
        type: Date,
        required: false,
    },
    numero_whatsapp: {
        type: String,
        required: false,
    },
    validated_academic_level: {
        type: String,
        required: false,
    },
    statut_actuel: {
        type: String,
        required: false,
    },
    other: {
        type: String,
        required: false,
    },
    languages: {
        type: String,
        required: false,
    },
    professional_experience: {
        type: String,
        required: false,
    },
    campus_choix_1: { type: String, required: false },
    campus_choix_2: { type: String, required: false },
    campus_choix_3: { type: String, required: false },

    programme: {
        type: String,
        required: false,
    },
    formation: {
        type: String,
        required: false,
    },
    rythme_formation: {
        type: String,
        required: false,
    },
    servicesEh: {
        type: [Boolean],
        required: false,
    },
    nomGarant: {
        type: String,
        required: false,
    },
    prenomGarant: {
        type: String,
        required: false,
    },
    nomAgence: {
        type: String,
        required: false,
    },
    donneePerso: {
        type: Boolean,
        required: false,
    },
    date_creation: {
        type: Date,
        required: false,
    },
    type_form: { type: String, required: false },
    code_commercial: { type: String, required: false },
    indicatif_whatsapp: {
        type: String,
        required: false,
    },
    step:{
        type:Number,
    },
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    indicatif:{
        type: String, 
        required: false
    },
    phone: {
        type: String, 
        required: false
    },
    email_perso: {
        type: String,
        required:false,
    },
    civilite: {
        type: String,
        default: "Monsieur"
    },
    pays_adresse: {
        type: String,
        required: false
    },
    nationnalite : { 
        type : String,
        required : false
    },
});

const forfeitForm = mongoose.model("forfeitForm", Schema);
module.exports = { forfeitForm }; 