//déclaration de la biblio mongoose pour l'utiliser c'est comme un import
const mongoose = require("mongoose");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
const sujet_schema= new mongoose.Schema({
    label:{
                type: String,
                required : true
            },
    service_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required:true
      }
   
    

});
//creation de la table avec le nom Sujet ( model/classe) à l'aide de la biblio mongoose et son schema
const Sujet= mongoose.model("sujet",sujet_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports={Sujet};