const mongoose = require('mongoose');



const projectv2Schema = mongoose.Schema({
    titre:                      { type: String, required: false },
    createur_id:                { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    createur:                   {type: String, required: false},
    created_date:               { type: Date, required: false},
    debut:                      { type: Date, required: false },
    fin:                        { type: Date, required: false  },
    description:                { type: String, required: false},
    creator_id:                 { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    responsable_id:             { type: mongoose.Schema.Types.ObjectId, ref: 'user' , required: false},
    responsable:                { type: String, required: false},
    etat:                       { type: String, required: false,default: "En cours" },
    avancement:                 { type: Number, required: false }, 
    identifian:                 { type: String, required: false},



});
const Project = mongoose.model('projects', projectv2Schema);
module.exports = { Project };
