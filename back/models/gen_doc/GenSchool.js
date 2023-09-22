const mongoose = require('mongoose');

const schemea = mongoose.Schema({
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    website: { type: String },
    uai: { type: String },
    siret: { type: String },
});

const GenSchool = mongoose.model('genSchool', schemea);
module.exports = { GenSchool };