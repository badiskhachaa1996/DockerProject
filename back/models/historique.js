//déclaration de la biblio mongoose pour l'utiliser c'est comme un import.
const mongoose = require("mongoose");

// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema.
const historique_schema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: false },
    role: { type: String, required: true }
});

//creation de la table anneeScolaire avec le nom AnneeScolaire ( model/classe) à l'aide de la biblio mongoose et son schema
const Historique = mongoose.model("historique", historique_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Historique };
