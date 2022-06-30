//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du shema de données de la table matiere
const matiereSchema = mongoose.Schema({
    nom: { type: String, required: true },
    formation_id: { type: mongoose.Schema.Types.ObjectId, ref: "diplome", required: true },
    volume_init: { type: Number, default: 0 },
    abbrv:{type:String,required:true},
    classe_id:{ type: mongoose.Schema.Types.ObjectId, ref: "Classe", required: true },
    seance_max:{type:Number,required:true}
});

//creation de la table matiere
const Matiere = mongoose.model('matiere', matiereSchema);
//export du model matiere
module.exports = { Matiere };