//déclaration de la bibliothèque mongoose
const mongoose = require("mongoose");
// création du schéma de la table etudiant 
const evaluationSchema = mongoose.Schema({
    label: { type: String },
    lien: { type: String },
    duree: { type: String },
    score: { type: String },
    Condition_admission: { type: String },
    description: { type: String },
    

});
const Evaluation= mongoose.model('evaluation', evaluationSchema);
module.exports = { Evaluation };