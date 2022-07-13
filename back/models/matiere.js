//Importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//Création du shema de données de la table matiere
const matiereSchema = mongoose.Schema({
    nom: { type: String, required: true },
    formation_id: { type: mongoose.Schema.Types.ObjectId, ref: "diplome", required: true },
    volume_init: { type: Number, default: 0 },
    abbrv:{type:String,required:true},
<<<<<<< HEAD
    classe_id:{ type: mongoose.Schema.Types.ObjectId, ref: "Classe", required: true },
    seance_max:{type:Number,required:true},
    coeff:{type:Number,required:true},
=======
    classe_id:{ type: mongoose.Schema.Types.ObjectId, ref: "classe", required: true },
    seance_max:{type:Number,required:true}
>>>>>>> ee4065d02ee5fbfb1b928c24a95f3d0b48900589
});

//creation de la table matiere
const Matiere = mongoose.model('matiere', matiereSchema);
//export du model matiere
module.exports = { Matiere };