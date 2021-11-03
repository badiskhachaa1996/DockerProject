//importation de la biblio mongoose
const mongoose = require('mongoose');
//creation du schema de la table diplome
const diplomeSchema = mongoose.Schema({
    titre: { type: String, required: true },
    titre_long: { type: String, required: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, red: "Campus", required: true },
    descriptions: { type: String, required: true },
    type_diplome: { type: String, required: true },
    type_etude: { type: String, required: true },
    domaine: { type: String, required: true },
    niveau: { type: String, required: true },
    certificateur: { type: String, required: true },
    code_RNCP: { type: String, required: true },
    duree: { type: Number, required: true },
    nb_heure: { typr: Number, required: true },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    rythme: { type: String, required: true },
    frais: { type: String, required: true },
    frais_en_ligne: { type: Number, required: true }

});

//creation de la table diplome et export du model Diplome 
const Diplome = mongoose.model("diplome",diplomeSchema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports={Diplome};