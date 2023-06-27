// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    objet: { type: String },
    body: { type: String },
    send_to: { type: mongoose.Schema.Types.ObjectId, ref: 'prospect' },
    send_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    send_from: { type: String },
    date_creation: { type: Date, default: Date.now },
    cc: { type: [String] },
});

//Creation de la table ecole et export du model Ecole
const HistoriqueEmail = mongoose.model("historiqueEmail", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { HistoriqueEmail };
