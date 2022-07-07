const mongoose = require("mongoose");
const ticket_schema= new mongoose.Schema({
    createur_id:{
        type: mongoose.SchemaTypes.ObjectId,
        required : true
    },
    sujet_id: {
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:"sujet"
    },
    date_ajout:{
        type: Date,
        required : true,
        default:Date.now()
    },
    agent_id:{
        type: mongoose.SchemaTypes.ObjectId
    },
    statut :{
        type: String,
        required:true,
        default: "Queue d'entrée"
    },
    date_affec_accep: {
        type: Date
    },
    
    date_fin_traitement : { 
        type : Date, 
        default : null
    },

    isAffected:{
        type:Boolean,
        default:null
    },
    description:{
        type:String,
        required:true
    },
    isReverted:{
        type:Boolean
    },
    justificatif:{
        type:String,
        default:""
    },
    date_revert:{
        type:Date
    },
    user_revert:{
        type:String
    },
    customid:{
        type:String,
        default:"ESTYANOPEPE10120000001"
    }
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const Ticket= mongoose.model("ticket",ticket_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports={Ticket};