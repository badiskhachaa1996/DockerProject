const mongoose = require('mongoose');

const abscenceCollaborateurSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    date_of_abscence: { type: String, required: true },
    motif: { type: String, required: true },
    periode: { type: String, required: true },
    file_name: { type: String, required: false },
});

const AbscenceCollaborateur = mongoose.model('abscence_collaborateur', abscenceCollaborateurSchema);
module.exports = { AbscenceCollaborateur };