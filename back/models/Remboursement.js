const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const remboursementSchema = new Schema({
   student:{
    type :{
        civility:{type: String},
          last_name:{type: String},
          first_name: {type: String},
          date_naissance:{type:Date},
          nationality: {type: String},
          country_residence: {type: String},
          phone: {type: String},
          indicatif_number:{type: String},
          email:{type: String},
          note: {type: String},
          montant: {type: String},
          payment_method: {type: String},
          payment_date:{type:Date}
    }
   },
   training : {
    type :
   { name: {type: String},
    scholar_year:{type: String},
    school: {type: String},}
   },
   refund: {
 type: { 
     method: {type: String},
    date:{type: Date},
    date_estimated: {type:Date},
    montant:{type: Number},
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
    motif: {type: String},
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
            link: {type: String},
            added_on: {type: Date},
            added_by:  {type: String},
            doc_number:{type: String},
        }, 
    },
    payement_attest: {
        type : {
            nom: {type: String},
                link: {type: String},
                added_on: {type: Date},
                added_by: {type: String},
                doc_number:{type: String},
        }, 
    },
    preuve_payement:{
        type : {
            nom: {type: String},
                link: {type: String},
                added_on: {type: Date},
                added_by: {type: String},
                doc_number:{type: String},
        }, 
    },
    doc_inscription: {
        type : {
         nom: {type: String},
            link: {type: String},
            added_on: {type: Date},
            added_by: {type: String},
             doc_number:{type: String},
        }, 
    },
    other_doc: {
        type : {
         nom: {type: String},
             link: {type: String},
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
