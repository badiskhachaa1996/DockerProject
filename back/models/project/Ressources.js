const mongoose = require('mongoose');



const ressourcesSchema = mongoose.Schema({
    nom:                { type: String, required: false},
    importance:         { type: String, required: false },
    project_id:         { type: mongoose.Schema.Types.ObjectId, ref: 'projects', required: false }



});
const Ressources = mongoose.model('ressources', ressourcesSchema);
module.exports = { Ressources };
