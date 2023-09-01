const mongoose = require('mongoose');

const schemea = mongoose.Schema({
    machine: { type: String },
    date: { type: Date },
    uid: { type: Number },
    type: { type: String }
});

const PointageData = mongoose.model('pointageData', schemea);
module.exports = { PointageData };