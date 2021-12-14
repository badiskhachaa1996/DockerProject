//declaration de la bibliothèque mongodb
const mongoose = require("mongoose");
//creation du schema de table campus
const note_schema = mongoose.Schema({
    score:{type:Number,default:0},
    user_id:{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    examen_id:{ type: mongoose.Schema.Types.ObjectId, ref: "examen", required: true }
});

//creation de la table avec le nom Campus ( model/classe) à l'aide de la biblio mongoose et son schema
const Notes= mongoose.model("note",note_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports={ Notes };
