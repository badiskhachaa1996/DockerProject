// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    name: { type: String },
    date_naissance: { type: Date },
    telephone: {
        type: {
            countryCode
                :
                { type: String },
            dialCode
                :
                { type: String },
            e164Number
                :
                { type: String },
            internationalNumber
                :
                { type: String },
            nationalNumber
                :
                { type: String },
            number
                :
                { type: String },
        }
    },
    mail: { type: String },
    ecole: { type: String },
    domaine: { type: String },
    destination: { type: [mongoose.Schema.Types.ObjectId], ref: "destinationMI" },
    dateSejour: { type: [mongoose.Schema.Types.ObjectId], ref: "dateSejourMI" },
    avantage: { type: String },
    date_creation: { type: Date, default: Date.now }
})

//Creation de la table ecole et export du model Ecole
const FormulaireMI = mongoose.model("formulaireMI", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { FormulaireMI };