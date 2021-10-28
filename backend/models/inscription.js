//déclaration de la biblio mongoose pour l'utiliser c'est comme un import
const mongoose = require("mongoose");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
//Ne pas oublier de modifier les champs classe et diplome après création des tables classe et diplomes
const inscriptionSchema= new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    classe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classe",
        default: null
    },
    statut: {
        type: String,
        required: true
    },
    diplome: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diplome",
        default: null
    },
    nationalite: {
        type: String,
        required: true
    },
    date_de_naissance: {
        type: Date,
        required: true
    }
});

//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose
const Inscription = mongoose.model("inscription",inscriptionSchema);
//Export du model Inscription dans d'autres composants
module.exports = { Inscription };