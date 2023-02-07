//importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table diplome
const diplomeSchema = mongoose.Schema({
    titre: { type: String, required: true },
    titre_long: { type: String, required: true },
    campus_id: { type: [mongoose.Schema.Types.ObjectId], ref: "campus", required: false },
    type_diplome: { type: String, required: true },
    domaine: { type: String, required: true },
    niveau: { type: String, required: true },
    certificateur: { type: String, required: false },
    code_RNCP: { type: String, required: true },
    nb_heure: { type: Number, required: true },
    date_debut: { type: Date },
    date_fin: { type: Date },
    rythme: { type: String, required: true },
    frais: { type: String },
    frais_en_ligne: { type: Number },
    isCertified: { type: Boolean, default: false },
    date_debut_examen: { type: Date },
    date_fin_examen: { type: Date },
    date_debut_stage: { type: Date },
    date_fin_stage: { type: Date },
    date_debut_semestre_1: { type: Date },
    date_fin_semestre_1: { type: Date },
    date_debut_semestre_2: { type: Date },
    date_fin_semestre_2: { type: Date },
    code_diplome: { type: String, required: true },
    imgNames:{type:[String],default:[]},
    imgTypes:{type:[String],default:[]},
    formateur_id:{type:mongoose.Schema.Types.ObjectId, ref: "formateur"},
    date_debut_semestre_3: { type: Date },
    date_fin_semestre_3: { type: Date },
    date_debut_semestre_4: { type: Date },
    date_fin_semestre_4: { type: Date },
    cb_an: { type: String,default:"2 ans" },
});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const Diplome = mongoose.model("diplome", diplomeSchema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Diplome };
