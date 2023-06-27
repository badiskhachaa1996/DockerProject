// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    email: { type: String },
    custom_id: { type: String },
    password: { type: { iv: String, encryptedData: String } },
    type: { type: String },
    signature_file: { type: String, default: null }
});

//Creation de la table ecole et export du model Ecole
const Mail = mongoose.model("mail", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Mail };
