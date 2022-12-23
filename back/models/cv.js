//importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table diplome
const cvSchema = mongoose.Schema({
    langues:        { type: [String], default: [] },
    user_id:        { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    experiences:    { type: [mongoose.Schema.Types.Mixed], required: false },
    connaissances:  { type: [mongoose.Schema.Types.Mixed], required: false },
    video_lien:     { type: String, required: false }
});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const CV = mongoose.model("cv", cvSchema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { CV };
