//importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table diplome
const Schema = mongoose.Schema({
    lead_before: { type: mongoose.Schema.Types.Mixed },
    lead_after: { type: mongoose.Schema.Types.Mixed },
    lead_id: { type: mongoose.Schema.Types.ObjectId, ref: "prospect", },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", },
    detail: { type: String },
    date_creation: { type: Date, default: Date.now }
});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const HistoriqueLead = mongoose.model("historiqueLead", Schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { HistoriqueLead };
