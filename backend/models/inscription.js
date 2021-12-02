//déclaration de la biblio mongoose pour l'utiliser c'est comme un import
const mongoose = require("mongoose");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
const inscriptionSchema= new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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
  
    
 
});

//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose
const Inscription = mongoose.model("inscription",inscriptionSchema);
//Export du model Inscription dans d'autres composants
module.exports = { Inscription };