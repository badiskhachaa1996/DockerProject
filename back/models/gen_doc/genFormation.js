const mongoose = require('mongoose');

const schemea = mongoose.Schema({
    name: { type: String },
    rncp: { type: String },
    niveau: { type: String },
    accrediteur: { type: String },
    duration: { type: String },
    price: { type: String },
});

const GenFormation = mongoose.model('genFormation', schemea);
module.exports = { GenFormation };