const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    ticketId:                       { type: [mongoose.Schema.Types.ObjectId], ref: 'ticket', required: false },
    libelle:                        { type: String, required: false },
    description_task:               { type: String, required: false },
    attribuate_to:                  { type: [mongoose.Schema.Types.ObjectId], ref: 'user', required: false },
    project_id:                     { type: mongoose.Schema.Types.ObjectId, ref: 'projects', required: false },
    number_of_hour:                 { type: Number, required: false }, 
    avancement:                     { type: Number, required: false }, 
    date_limite:                    { type: Date, required: false },
    etat:                           { type: String, required  : false,default: "En attente de traitement" },
    priorite:                       { type: String, required  : false },
    consignes:                      { type:[String], required: false},
    validation:                     { type: String, required: false},
    identifian:                     { type: String, required: false},
    urgent:                         { type: Boolean, required:false,default: false},
    documents: {
        type: [{
            nom: { type: String, required: false },
            path: { type: String, required: false },
        }],
    },

});

const Task = mongoose.model('tasks', taskSchema);
module.exports = { Task };