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
    identifian:                     { type: Number, required: false},
    urgent:                         { type: Boolean, required:false,default: false},
    documents: {
        type: [{
            nom: { type: String, required: false },
            path: { type: String, required: false },
        }],
        default: []
    },
    attribuate_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    attribuate_date: { type: Date, required: false },
    commentaires: {
        type: [{
            description: { type: String, required: false },
            by: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
            date: { type: Date, required: false },
        }],
        default: []
    },
    labels: {
        type: [mongoose.Schema.Types.ObjectId], ref: 'label',
        default: []
    },
    createdDate:                    { type: Date, required: false },
});

const Task = mongoose.model('tasks', taskSchema);
module.exports = { Task };