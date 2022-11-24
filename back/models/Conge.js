const mongoose = require('mongoose');

/**
 * Les status pour les demandes de congés sont
 * - En attente
 * - Refusé
 * - Approuvé
 * 
 * Les types de congés sont
 * - Maladie
 * - Payés
 * - Sans soldes
 * - Maternité
 */

const congeSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    referent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    type_conge: { type: String, required: true },
    date_debut: { type: String, required: true },
    date_fin: { type: String, required: true },
    statut: { type: String, required: false },
});

const Conge = mongoose.model('conge', congeSchema);
module.exports = { Conge };