const mongoose = require('mongoose');

const appreciationSchema = mongoose.Schema({
    appreciation: { type: String, required: true },
    semestre: { type: String, required: true },
    etudiant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant', required: true }
});

const Appreciation = mongoose.model('appreciation', appreciationSchema);
module.exports = { Appreciation };