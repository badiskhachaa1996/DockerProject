const mongoose = require('mongoose');

const schemea = mongoose.Schema({
    type_certif: { 
        type: {
            label: { type: String },
            value: { type: String },
            title: { type: String },
        }
    },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'genSchool'},
    campus: { type: mongoose.Schema.Types.ObjectId, ref: 'genCampus' },
    formation: { type: mongoose.Schema.Types.ObjectId, ref: 'genFormation' },
    rentre: { type: mongoose.Schema.Types.ObjectId, ref: 'genRentre' },
    alternance:{ type: Boolean },
    civilite:{ type: String },
    student: { 
        type: {
            full_name: { type: String },
            birth_date: { type: String },
            birth_place: { type: String },
        }
    },
    amount_paid :{ type: String },
    paiement_method: { type: String },
    check: { type: String },
    bank: { type: String },
    id_doc:{ type: String , unique: true },
    date: { type: String },
    place_created: { type: String },
    created_on: { type: Date, default: Date.now },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
});

const GenDoc = mongoose.model('genDoc', schemea);
module.exports = { GenDoc };