//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Creation du schema de la table presence
const presenceSchema = mongoose.Schema({
    seance_id:      { type: mongoose.Schema.Types.ObjectId, ref: "Seance", required: true },
    user_id:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPresent:      { type: Boolean, required: true },
    signature:      { type: Boolean, default: false },
    justificatif:   { type: Boolean, default: false }
});

//Creation de la table presence et export du model Presence   
const Presence = mongoose.model("Presence", presenceSchema);
module.exports = {Presence};