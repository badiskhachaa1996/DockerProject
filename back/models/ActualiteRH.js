const mongoose = require('mongoose');

const schemea = mongoose.Schema({
    date_creation: { type: Date, required: true, default: Date.now },
    titre: { type: String },
    description: { type: String },
    campus: { type: String },
});

const ActualiteRH = mongoose.model('actualiteRH', schemea);
module.exports = { ActualiteRH };