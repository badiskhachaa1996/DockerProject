//déclaration de la bibliothèque mongoose
const mongoose = require("mongoose");
// création du schéma de la table etudiant 
const evaluationSchema = mongoose.Schema({
    label: { type: String },
    lien: { type: String },
    duree: { type: Number, default: 30 },
    score: { type: Number, default: 20 },
    Condition_admission: { type: String },
    description: { type: String },
    etat: { type: String, default: 'Disponible' }
});
const Evaluation = mongoose.model('evaluation', evaluationSchema);
module.exports = { Evaluation };