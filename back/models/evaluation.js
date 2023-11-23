//déclaration de la bibliothèque mongoose
const mongoose = require("mongoose");
// création du schéma de la table etudiant 
const evaluationSchema = mongoose.Schema({
    label: { type: String },
    lien: { type: String },
    duree: { type: String },
    score: { type: Number, default: 20 },
    Condition_admission: { type: String },
    description: { type: String },
    etat: { type: String, default: 'Disponible' },
    resultats: {
        type: [{
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            note: { type: Number },

            date_passation: { type: Date },
            duree_mise: { type: Number, default: 30 },

        }]
    }


});
const Evaluation = mongoose.model('evaluation', evaluationSchema);
module.exports = { Evaluation };