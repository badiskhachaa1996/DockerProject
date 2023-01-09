//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    old_cfa: { type: mongoose.Schema.Types.ObjectId, ref: 'ecole' },
    new_cfa: { type: mongoose.Schema.Types.ObjectId, ref: 'ecole' },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date },
});

const HistoCFA = mongoose.model('histo_cfa', noteSchema);
module.exports = { HistoCFA };