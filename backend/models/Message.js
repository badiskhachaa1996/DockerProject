const mongoose = require("mongoose");
const message_schema= new mongoose.Schema({
    description:{
        type: String,
        required : true
    },
    document: {
        type:String
    },
    user_id:{
         type: String,
         required:true
        },
    ticket_id:{
        type: String,
         required:true
    },
    date_ajout:{
        type: Date,
        required : true,
        default:Date.now()
    }
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const Message= mongoose.model("message",message_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports={Message};