const mongoose = require('mongoose');

const schemea = mongoose.Schema({
    date_creation: { type: Date, required: true, default: Date.now },
    titre: { type: String },
    description: { type: String }
});

const ActualiteInt = mongoose.model('actualiteInt', schemea);
module.exports = { ActualiteInt };