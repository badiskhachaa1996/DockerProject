//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du schema de données de la table alternant
const alternantSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true },
    classe_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: false },
    statut: { type: String, required: false },
    nationalite: { type: String, required: false },
    date_de_naissance: { type: Date, required: false },
    entreprise_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Entrepise', required: true }
});

//Création de la table alternant via le schema de données de la table
const Alternant = mongoose.model('alternant', alternantSchema);
//Export du model alternant
module.exports = { Alternant };