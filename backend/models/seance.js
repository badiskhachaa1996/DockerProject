//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Creation du schema de la table seance
const seanceSchema = mongoose.Schema({
    //classe_id: { type: mongoose.Schema.Types.ObjectId, ref: "Classe", required: true },
    classe_id: { type: String, required: true },
    matiere_id: { type: String, required: true },
    libelle: { type: String, required: false },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    formateur_id: { type: String, required: false },
    infos: { type: String, required: false }
    //formateur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Formateur', required: false }
});

//Creation de la table seance et export du model Seance
const Seance = mongoose.model("seance",seanceSchema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports={Seance};