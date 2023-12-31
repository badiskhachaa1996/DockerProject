// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    titre: { type: String, },
    adresse: { type: String, },
    email: { type: String, },
    site_web: { type: String, },
    url_form: { type: String, },
    formations: { type: [mongoose.Schema.Types.ObjectId], ref: 'formationAdmission', default: [] },
    campus: { type: [String], default: [] },
    langue: { type: String, default: 'Français' },
    NDA:{ type: String},
    campusinfo:[{
        campus: String,
        adresse: String,
        UAI: String,
    }],
});

//Creation de la table ecole et export du model Ecole
const EcoleAdmission = mongoose.model("ecoleAdmission", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { EcoleAdmission };
