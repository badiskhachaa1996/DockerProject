//importation de la bibliothèque mongoose
const mongoose = require('mongoose');

//creation du schema de la table team
const teamSchema = mongoose.Schema({

    user_id:        { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    libelle:        { type: String, required: false },
    abbreviation:   { type: String, required: false },
    responsable_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

});

//creation de la table avec le nom Team (model/classe) à l'aide de la biblio mongoose et son schema
const Team = mongoose.model('team', teamSchema);

//export du model 
module.exports = { Team };