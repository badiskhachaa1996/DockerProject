const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    libelle: { type: String, required: false },
    color: { type: String, required: false },
});

const Label = mongoose.model('label', taskSchema);
module.exports = { Label };