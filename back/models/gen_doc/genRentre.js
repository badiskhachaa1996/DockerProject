const mongoose = require('mongoose');

const schemea = mongoose.Schema({
    type: { type: String },
    date_rentre: { type: String },
    date_limite: { type: String },
    formation_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'genFormation' , required: true },
});

const GenRentre = mongoose.model('genRentre', schemea);
module.exports = { GenRentre };