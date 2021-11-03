//déclaration de la biblio mongoose pour l'utiliser c'est comme un import.
const mongoose = require("mongoose");

// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema.
const anneeScolaire_schema = new mongoose.Schema({

    libelle: {type : String, required: true },
    etat : { type : String, required: true },

});

//Creation de la table anneeScolaire et export du model anneeScolaire
module.exports = mongoose.model("anneeScolaire", anneeScolaire_schema);