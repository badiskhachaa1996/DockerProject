//déclaration de la biblio mongoose pour l'utiliser c'est comme un import.
const mongoose = require("mongoose");

// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema.
const schema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    links: { type: [mongoose.Schema.Types.Mixed], default: [] }, // {label:string,link:string}

});

//creation de la table anneeScolaire avec le nom AnneeScolaire ( model/classe) à l'aide de la biblio mongoose et son schema
const Dashboard = mongoose.model("dashboard", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Dashboard };
