//declaration de la bibliothèque mongodb
const mongoose = require("mongoose");
//creation du schema de table campus
const campus_schema = mongoose.Schema({
    libelle: { type: String, required: true },
    ecole_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ecole", required: true },
    ville: { type: String, required: true },
    pays: { type: String, required: true },
    email: { type: String, required: true },
    adresse: { type: String, required: true },
    site: { type: String, required: false }
});

//creation de la table avec le nom Campus ( model/classe) à l'aide de la biblio mongoose et son schema
const Campus= mongoose.model("campus",campus_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports={ Campus };
