//importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table diplome
const cvTypeSchema = mongoose.Schema({
    user_id:            { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    experiences_pro:    { type: [String], required: false },
    experiences_sco:    { type: [String], required: false },
    competences:        { type: [String], required: false },
    langues:            { type: [String], required: false },
    video_lien:         { type: String, required: false },
    filename:           { type: String, required: false }
});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const CvType = mongoose.model('cv_type', cvTypeSchema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { CvType };
