//déclaration de la biblio mongoose pour l'utiliser c'est comme un import.
const mongoose = require("mongoose");

// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema.
const anneeScolaire_schema = new mongoose.Schema({

    libelle: {type : String, required: true },
    etat : { type : String, required: true },

});

//creation de la table avec le nom AnneeScolaire ( model/classe) à l'aide de la biblio mongoose et son schema
const AnneeScolaire= mongoose.model("anneeScolaire", anneeScolaire_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports={ AnneeScolaire };
