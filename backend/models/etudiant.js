//déclaration de la bibliothèque mongoose
const mongoose = require("mongoose");
// création du schéma de la table etudiant 
const etudiant_schema = mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, ref : "User", required: true },
    classe_id : { type: mongoose.Schema.Types.ObjectId, ref : "Classe", required: true },
    statut : { type: String, required: true },
    //nationalite: { type: String, required: true },
    //date_de_naissance: { type: Date, required: true },
});

//création de la table Etudiant ( model/classe) à l'aide de la biblio mongoose
const Etudiant = mongoose.model("etudiant", etudiant_schema);
//Export du model Etudiant dans d'autres composants
module.exports = { Etudiant };