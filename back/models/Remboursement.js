const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const remboursementSchema = new Schema({
   student:{
    type :{
        civility:{type: String ,required:true},
          last_name:{type: String},
          first_name: {type: String},
          date_naissance:{type:Date},
          nationality: {type: String},
          country_residence: {type: String},
          phone: {type: String},
          indicatif_phone:{type: String},
          email:{type: String , unique: true,required:true},
          note: {type: String,required:true},
          montant: {type: String ,required:true},
          payment_method: {type: String , required:true},
          payment_date:{type:Date ,required:true}
    }
   },
   training : {
    type :
   { name: {type: String ,required:true},
    scholar_year:{type: String,required:true},
    school: {type: String ,required:true},}
   },
   refund: {
 type: { 
     method: {type: String,required:true},
    date:{type: Date,required:true},
    date_estimated: {type:Date,required:true},
    montant:{type: Number,required:true},
    note:{type: String},
}
},
   payment: [
    {
    note:{type: String},
    montant: {type: String},
    method:{type: String},
    date: {type: Date},
}
],
motif: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  
      status:{type: String},
    comments: [
        {
            note:{type: String},
            created_by: {type: String},
            created_on: {type: Date},
        }
    ],
    docs:
     { rib: {
        type : {
            nom: {type: String},
            added_on: {type: Date},
            added_by:  {type: String},
            doc_number:{type: String},
        }, 
    },
    attestation_payement: {
        type : {
            nom: {type: String},
                added_on: {type: Date},
                added_by: {type: String},
                doc_number:{type: String},
        }, 
    },
    preuve_payement:{
        type : {
            nom: {type: String},
                added_on: {type: Date},
                added_by: {type: String},
                doc_number:{type: String},
        }, 
    },
    document_inscription: {
        type : {
         nom: {type: String},
            added_on: {type: Date},
            added_by: {type: String},
             doc_number:{type: String},
        }, 
    },
    autres_doc: {
        type : {
         nom: {type: String},
             added_on: {type: Date},
             added_by: {type: String},
             doc_number:{type: String},
        }, 
    },},
    
    created_on: {type: Date},
    created_by:{type:String}
});
const Remboursement = mongoose.model('remboursement', remboursementSchema);
module.exports = { Remboursement }; 
