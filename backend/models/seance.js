//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Creation du schema de la table seance
const seanceSchema = mongoose.Schema({
    classe_id: { type: mongoose.Schema.Types.ObjectId, ref: "Classe", required: true },
    date_debut: { type: Date, required: true },
    date_fin: { typr: Date, required: true }
});

//Creation de la table seance et export du model Seance
module.exports = mongoose.model("Seance", seanceSchema);