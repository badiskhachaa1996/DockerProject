
// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    objet: { type: String },
    custom_id: { type: String },
    body: { type: String },
    type: { type: String },
    date_creation: { type: Date, default: Date.now },
    pieces_jointe: {
        type: [
            {
                date: Date,
                nom: String,
                path: String
            }
        ], default: []
    }
});

//Creation de la table ecole et export du model Ecole
const MailType = mongoose.model("mailType", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { MailType };
