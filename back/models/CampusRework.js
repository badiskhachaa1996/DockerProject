//declaration de la bibliothèque mongodb
const mongoose = require("mongoose");
//creation du schema de table campus
const campus_schema = mongoose.Schema({
    libelle: { type: String, required: true },
    adresse: { type: String, required: true },
    ecoles: {
        type: [
            {
                ecole_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ecoleAdmission' },
                email: { type: String }
            }
        ], ref: "ecole", default: []
    },
    salles: { type: [String], default: [] }
});

//creation de la table avec le nom Campus ( model/classe) à l'aide de la biblio mongoose et son schema
const CampusRework = mongoose.model("campusRework", campus_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { CampusRework };
