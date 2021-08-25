const mongoose = require("mongoose");
const ticket_schema= new mongoose.Schema({
    createur_id:{
        type: String,
        required : true
    },
    sujet_id: {
        type:String,
        required:true
    },
    message_id:{
         type: [any]
        },
    date_ajout:{
        type: Date,
        required : true,
        default:Date.now()
    },
    agent_id:{
        type: String
    },
    statut :{
        type: String,
        required:true,
        default: "Queue d'entrée"
    },
    date_affec_accep: {
        type: Date
    },
    temp_traitement:{
        type: String
    },
    temp_fin:{
        type: String
    },
    isAffected:{
        type:Boolean,
        required:true,
        default:null
    }
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const Ticket= mongoose.model("ticket",ticket_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports={Ticket};