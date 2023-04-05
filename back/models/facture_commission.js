//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du shema de données de la table matiere
const sch = mongoose.Schema({
    numero: { type: String },
    montant: { type: Number },
    tva: { type: Number },
    statut: { type: String },
    nature: { type: String },
    date_paiement: { type: Date },
    partenaire_id: { type: mongoose.Schema.Types.ObjectId, ref: "partenaire" },
    factureUploaded: { type: Boolean, default: false }
});

//creation de la table matiere
const FactureCommission = mongoose.model('factureCommission', sch);
//export du model matiere
module.exports = { FactureCommission };