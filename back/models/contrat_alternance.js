//importation de la bibliothèque mongoose
const mongoose = require("mongoose");
//creation du schema de la table diplome
const contrat_alternanceSch = mongoose.Schema({
  debut_contrat: { type: Date, required: true },
  fin_contrat: { type: Date, required: true },
  horaire: { type: String },
  alternant_id: { type: mongoose.Schema.Types.ObjectId, ref: "etudiant" },
  intitule: { type: String },
  classification: { type: String },
  niveau_formation: { type: String },
  coeff_hierachique: { type: String },
  formation: { type: mongoose.Schema.Types.ObjectId, ref: "diplome" },
  tuteur_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tuteur",
    required: false,
  },
  directeur_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false,
  },
  entreprise_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "entreprise",
    required: false,
  },
  code_commercial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false,
  },
  statut: { type: String, required: false },
  anne_scolaire: { type: [String], required: false },
  ecole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ecole",
    required: false,
  },
  cout_mobilite_status: { type: String, required: false },
  cout_mobilite: { type: Number, required: false },
  cout_mat_ped_status: { type: String, required: false },
  cout_mat_ped: { type: Number, required: false },
  cout_dl_help_status: { type: String, required: false },
  cout_dl_help: { type: Number, required: false },
  cerfa: { type: String, required: false },
  convention_formation: { type: String, required: false },
  resiliation_contrat: { type: String, required: false },
  accord_prise_charge: { type: String, required: false },
  relance: { type: String, required: false },
  last_status_change_date: { type: Date, required: false },
  remarque: { type: String, required: false },
  livret_apprentissage: { type: String, required: false },
});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const CAlternance = mongoose.model("contrat_alternance", contrat_alternanceSch);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { CAlternance };
