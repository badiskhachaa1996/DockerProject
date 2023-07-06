// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    condition: { type: String },
    custom_id: { type: String },
    mailType: { type: mongoose.Schema.Types.ObjectId, ref: 'mailType', required: false },
    mail: { type: mongoose.Schema.Types.ObjectId, ref: 'mail', required: false },
    etat: { type: String, default: 'En cours d\'automatisation' },
    date_creation: { type: Date, default: Date.now }
});

//Creation de la table ecole et export du model Ecole
const MailAuto = mongoose.model("mailAuto", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { MailAuto };
