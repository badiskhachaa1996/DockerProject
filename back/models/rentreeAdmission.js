// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    nom: { type: String, },
    date_debut_inscription: { type: Date, },
    date_fin_inscription: { type: Date, },
    date_commencement: { type: Date, },
    ecoles: { type: [mongoose.Schema.Types.ObjectId], ref: 'ecoleAdmission', default: [] }
});

//Creation de la table ecole et export du model Ecole
const RentreeAdmission = mongoose.model("rentreeAdmission", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { RentreeAdmission };
