const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    libelle:                        { type: String, required: false },
    percent:                        { type: Number, required: false },
    created_at:                     { type: Date, required: false },
});

const Project = mongoose.model('projects', projectSchema);
module.exports = { Project };