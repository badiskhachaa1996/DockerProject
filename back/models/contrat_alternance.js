//importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table diplome
const contrat_alternanceSch = mongoose.Schema({
    debut_contrat: { type: Date, required: true },
    fin_contrat: { type: Date, required: true },
    horaire: { type: String },
    intitule: { type: String, required: true },
    classification: { type: String, required: true },
    niveau_formation: { type: String, required: true },
    coeff_hierachique: { type: String, required: true },
    formation: { type: mongoose.Schema.Types.ObjectId, ref: "diplome" },
    alternant_id: { type: mongoose.Schema.Types.ObjectId, ref: "etudiant" },
    tuteur_id: { type: mongoose.Schema.Types.ObjectId, ref: "tuteur" },
    code_commercial: { type: String, required: false }
    
});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const CAlternance = mongoose.model("contrat_alternance", contrat_alternanceSch);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { CAlternance };
