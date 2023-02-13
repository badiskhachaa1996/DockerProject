//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Creation du schema de la table presence
const presenceSchema = mongoose.Schema({
    seance_id: { type: mongoose.Schema.Types.ObjectId, ref: "seance", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    isPresent: { type: Boolean, required: true },
    signature: { type: Boolean, default: false },
    justificatif: { type: Boolean, default: false },
    date_signature: { type: Date },
    allowedByFormateur: { type: Boolean, default: false },
    PresentielOrDistanciel: { type: String, default: "Présentiel" }
});

//Creation de la table presence et export du model Presence   
const Presence = mongoose.model("Presence", presenceSchema);
module.exports = { Presence };