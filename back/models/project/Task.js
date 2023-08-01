const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    ticket_id:                      {type: [mongoose.Schema.Types.ObjectId], ref: 'ticket', required: false },
    libelle:                        { type: String, required: false },
    description_task:                    { type: String, required: false },
    attribuate_to:                  { type: [mongoose.Schema.Types.ObjectId], ref: 'user', required: false },
    project_id:                     { type: mongoose.Schema.Types.ObjectId, ref: 'projects', required: false },
    number_of_hour:                 { type: Number, required: false },  
    date_limite:                    { type: Date, required: false },
    etat:                           { type: String, required  : false },
    priorite:                       { type: String, required  : false }
});

const Task = mongoose.model('tasks', taskSchema);
module.exports = { Task };