// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    name: { type: String },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "destinationMI" },
})

//Creation de la table ecole et export du model Ecole
const DateSejourMI = mongoose.model("dateSejourMI", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { DateSejourMI };