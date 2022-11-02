//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Creation du schema de la table seance
const seanceSchema = mongoose.Schema({
    classe_id: { type: [mongoose.Schema.Types.ObjectId], ref: "classe", required: true },
    matiere_id: { type: mongoose.Schema.Types.ObjectId, ref: 'matiere', required: true },
    libelle: { type: String, required: false },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    formateur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'formateur', required: false },
    infos: { type: String, required: false },
    isPresentiel: { type: String, default: false },
    salle_name: { type: String },
    isPlanified: { type: Boolean, default: false },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'campus', required: false },
    nbseance: { type: Number, required: false },
    fileRight: { type: [mongoose.Schema.Types.Mixed], default: [] },//{name:"",right:false,upload_by:mongoose.Schema.Types.ObjectId}
    remarque: { type: String },
    seance_type: { type: String, default: "Séance" }
});

//Creation de la table seance et export du model Seance
const Seance = mongoose.model("seance", seanceSchema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Seance };