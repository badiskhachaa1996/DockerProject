// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    nom: { type: String },
    description: {type:  String } ,
});

//Creation de la table ecole et export du model Ecole
const OperationCRM = mongoose.model("operation", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { OperationCRM };
