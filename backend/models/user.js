//déclaration de la biblio mongoose pour l'utiliser c'est comme un import
const mongoose = require("mongoose");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
const user_schema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "user",
        required: true
    },
    etat: {
        type: Boolean,
        default: false
    },
    adresse: {
        type: String
    },
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: false
    },
    civilite: {
        type: String,
        default: "Monsieur"
    },
    pathImageProfil: {
        type: String,
    },
    typeImageProfil: {
        type: String
    },
    campus:{
        type: String,
        default:"Paris"
    },
    type:{
        type: String,
        default:"Etudiant"
    },
    formation:{
        type: String,
        default:"MPI"
    },
    entreprise:{
        type: String,
        default:"Elitelabs"
    }
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const User = mongoose.model("user", user_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { User };