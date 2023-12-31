const mongoose = require("mongoose");
const message_schema= new mongoose.Schema({
    description:{
        type: String,
        required : true
    },
    document: {
        type:String
    },
    documentType:{
        type:String
    },
    user_id:{
         type: mongoose.SchemaTypes.ObjectId,
         required:true,
         ref:'user'
        },
    ticket_id:{
        type: mongoose.SchemaTypes.ObjectId,
         required:true,
         ref:'ticket'
    },
    date_ajout:{
        type: Date,
        required : true,
        default:Date.now()
    },
    isRep:{
        type:Boolean,
    },
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const Message= mongoose.model("message",message_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports={Message};