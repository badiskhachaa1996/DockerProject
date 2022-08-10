const mongoose = require("mongoose");
const schema= new mongoose.Schema({
    etat:{
        type: Boolean,
        required : true,
        default:false
    },
    type: {
        type:String,
        required :  true
    },
    date_ajout:{
        type:Date,
        required:true,
        default:Date.now()
    },
    info_id:{
        type: mongoose.SchemaTypes.ObjectId,
      
         ref:'ticket'
    },
    user_id:{
        type: mongoose.SchemaTypes.ObjectId,
     
        ref:'user'
    },
    service_id:{
        type: mongoose.SchemaTypes.ObjectId,
       
        ref:'service'
    }
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const Notification= mongoose.model("notification",schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports={Notification};