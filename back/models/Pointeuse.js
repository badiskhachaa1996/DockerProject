const mongoose = require('mongoose');

const schemea = mongoose.Schema({
    serial_number: { type: String, unique: true },
    localisation: { type: String },
    pointageType: { type: [String] },
    modele: { type: String },
    emplacement: { type: String },
});

const Pointeuse = mongoose.model('pointeuse', schemea);
module.exports = { Pointeuse };