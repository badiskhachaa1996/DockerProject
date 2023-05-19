// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    name: { type: String },
    age: { type: Number },
    phone: {
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
    email: { type: String },
    occupation: { type: String },
    field: { type: String },
    langue: { type: String },
    date_creation: { type: Date, default: Date.now }
});

//Creation de la table ecole et export du model Ecole
const FormulaireICBS = mongoose.model("formulaireICBS", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { FormulaireICBS };
