//importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table diplome
const tuteurSch = mongoose.Schema({
    prospect_id: { type: mongoose.Schema.Types.ObjectId, ref: "prospect" },
    produit: { type: String },
    montant: { type: Number },
    tva: { type: Number },
    statutCommission: { type: String },
    date_reglement: { type: Date }
});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const Vente = mongoose.model("vente", tuteurSch);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Vente };
