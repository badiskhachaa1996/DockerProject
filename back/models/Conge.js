const mongoose = require('mongoose');

/**
 * Les status pour les demandes de congés sont
 * - En attente
 * - Refusé
 * - Validé
 * 
 * Les types de congés sont
 * - Maladie
 * - Payés
 * - Sans soldes
 * - Maternité
 */

const congeSchema = mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    date_demande: { type: Date, required: false },
    type_conge: { type: String, required: false },
    other_motif: { type: String, required: false },
    date_debut: { type: Date, required: false },
    date_fin: { type: Date, required: false },
    nombre_jours: { type: Number, required: false },
    motif: { type: String, required: false },
    justificatif: { type: String, required: false },
    statut: { type: String, required: false },
    note_decideur: { type: String, required: false },
    valided_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    valided_date: { type: Date, required: false },
    commented_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    commented_date: { type: Date, required: false },
    urgent: { type: Boolean, default: false },
    customid_ticket: { type: String, }

});

const Conge = mongoose.model('conge', congeSchema);
module.exports = { Conge };