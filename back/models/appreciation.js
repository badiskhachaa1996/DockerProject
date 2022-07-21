const mongoose = require('mongoose');

const appreciationSchema = mongoose.Schema({
    appreciation: { type: String, required: true },
    semestre: { type: String, required: true },
    etudiant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'etudiant', required: true },
    appreciation_matiere: { type: mongoose.Schema.Types.Mixed, default:{}}
});

const Appreciation = mongoose.model('appreciation', appreciationSchema);
module.exports = { Appreciation };