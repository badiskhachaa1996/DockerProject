const mongoose = require('mongoose');

const missionSchema = mongoose.Schema({
    missionType:        { type: String, required: false },
    debut:              { type: Date, required: false },
    missionName:        { type: String, required: false },
    missionDesc:        { type: String, required: false },
    entreprise_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'entreprise', required: false }, 
    profile:            { type: String, required: false },
    competence:         { type: [String], required: false },
    isClosed:           { type: Boolean, required: false },
});

const Mission = mongoose.model('mission', missionSchema);
module.exports = { Mission };