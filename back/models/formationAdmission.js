// déclaration de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table ecole
const schema = new mongoose.Schema({
    nom: { type: String, },
    niveau: { type: String, },
    rncp: { type: String, },
    certificateur: { type: String, },
    duree: { type: String, },
    description: { type: String, },
    criteres: { type: String, },
    tarif: { type: String, },
    langue: { type: String, },
    deroulement: { type: String, },
});

//Creation de la table ecole et export du model Ecole
const FormationAdmission = mongoose.model("formationAdmission", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { FormationAdmission };
