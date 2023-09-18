const mongoose = require('mongoose');

const schemea = mongoose.Schema({
    name: { type: String },
    adress: { type: String },
});

const GenCampus = mongoose.model('genCampus', schemea);
module.exports = { GenCampus };