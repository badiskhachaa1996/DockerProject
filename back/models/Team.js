//importation de la bibliothèque mongoose
const mongoose = require('mongoose');

//creation du schema de la table team
const teamSchema = mongoose.SchemaType({

    user_id:        { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    libelle:        { type: String },
    abbreviation:   { type: String },
    responsable_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

});

//creation de la table avec le nom Team (model/classe) à l'aide de la biblio mongoose et son schema
const teamsSchema = mongoose.model('team', teamSchema);

//export du model 
module.exports = { Team };