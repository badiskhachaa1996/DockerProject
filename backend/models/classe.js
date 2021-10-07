const mongoose = require("mongoose");
const schema= new mongoose.Schema({
    description:{
        type: String
    },
    nom:{
        type:String,
        required:true
    },
    nom_court:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        default:true
    }
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const Classe= mongoose.model("classe",schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports={Classe};