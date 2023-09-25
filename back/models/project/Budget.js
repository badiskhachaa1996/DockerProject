const mongoose = require('mongoose');



const budgetSchema = mongoose.Schema({
    libelle:                { type: String, required: false},
    charge:         { type: Number, required: false },
    depense:         { type: Number, required: false },
    project_id:         { type: mongoose.Schema.Types.ObjectId, ref: 'projects', required: false }



});
const Budget= mongoose.model('budget', budgetSchema);
module.exports = { Budget };