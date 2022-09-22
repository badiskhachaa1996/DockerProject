const mongoose = require('mongoose');

const logementSchema = mongoose.Schema({
    localite: { type: String, required: false },
    image: { type: String, required: false },
    surface: { type: Number, required: false },
    pieces: { type: Number, required: false },
    type: { type: String, required: false },
    capacite: { type: Number, required: false },
    description: { type: String, required: false },
    prix: { type: mongoose.Schema.Types.Mixed, required: false },
    caracteristiques: { type: mongoose.Schema.Types.Mixed, required: false },
});

const Logement = mongoose.model('logement', logementSchema);
module.exports = { Logement };