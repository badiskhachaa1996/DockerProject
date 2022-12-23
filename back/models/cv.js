//importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table diplome
const cvSchema = mongoose.Schema({
    user_id:            { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    experiences_pro:    { type: [mongoose.Schema.Types.Mixed], required: false },
    experiences_sco:    { type: [mongoose.Schema.Types.Mixed], required: false },
    competences:        { type: [mongoose.Schema.Types.Mixed], required: false },
    langues:            { type: [String], default: [] },
    video_lien:         { type: String, required: false },
    filename:           { type: String, required: false }
});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const CV = mongoose.model("cv", cvSchema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { CV };
