const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    libelle:                        { type: String, required: false },
    percent:                        { type: Number, required: false },
    attribuate_to:                  { type: [mongoose.Schema.Types.ObjectId], ref: 'user', required: false },
    project_id:                     { type: mongoose.Schema.Types.ObjectId, ref: 'projects', required: false },
    number_of_day:                  { type: Number, required: false },  
    date_limite:                    { type: Date, required: false },
    created_at:                     { type: Date, required: false },
    creator_id:                     { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
});

const Task = mongoose.model('tasks', taskSchema);
module.exports = { Task };