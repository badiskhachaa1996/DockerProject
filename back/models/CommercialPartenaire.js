//Recuperation de la bibliothèque mongoose
const mongoose = require('mongoose');

//Création du modèle de données de la table commercial
const commercialPartenaireSchema = mongoose.Schema({
    partenaire_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Partenaire', required: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    code_commercial_partenaire: { type: String, required: false },
    statut: { type: String, required: false },
    isAdmin: { type: Boolean, default: false }
});

//Création de la table puis exportation du modele partenaire
const CommercialPartenaire = mongoose.model('commercial_partenaire', commercialPartenaireSchema);
module.exports = { CommercialPartenaire };