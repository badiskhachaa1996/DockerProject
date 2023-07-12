//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du shema de données de la table matiere
const sch = mongoose.Schema({
    date_creation: { type: Date },
    semestre: { type: String },
    classe_id: { type: mongoose.Schema.Types.ObjectId, ref: "classe" },
    pv_annuel_data: { type: mongoose.Schema.Types.Mixed },
    pv_annuel_cols: { type: mongoose.Schema.Types.Mixed },
    nom: { type: String }
});

//creation de la table matiere
const PVAnnuel = mongoose.model('pvAnnuel', sch);
//export du model matiere
module.exports = { PVAnnuel };