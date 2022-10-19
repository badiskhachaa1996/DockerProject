const mongoose = require('mongoose');

const missionSchema = mongoose.Schema({
    user_id:            { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false }, 
    missionType:        { type: String, required: false },
    debut:              { type: Date, required: false },
    missionName:        { type: String, required: false },
    missionDesc:        { type: String, required: false },
    entreprise_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'entreprise', required: false }, 
    profil:             { type: String, required: false },
    competences:        { type: [String], required: false },
    workplaceType:      { type: String, required: false },
    publicationDate:    { type: Date, required: false },
    isClosed:           { type: Boolean, required: false },
});

const Mission = mongoose.model('mission', missionSchema);
module.exports = { Mission };