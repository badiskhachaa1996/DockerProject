const mongoose = require('mongoose');

const dailyCheckSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    today: { type: String, required: true },
    check_in: { type: Date, required: false },
    pause: { type: [{ in: Date, out: Date, motif: String }], required: false, default: [] },
    isInPause: { type: Boolean, required: false },
    cra: { type: [{ task: { type: String, required: false }, number_minutes: { type: Number, required: false } }], required: false, default: [] },
    is_anticipated: { type: Boolean, required: false },
    check_out: { type: Date, required: false },
    taux_cra: { type: String, required: false },
    pause_timing: { type: Number, required: false },
    validated: { type: Boolean, default: false },
    commentaire: { type: String, required: false },
    commented_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user', },
    commented_date: { type: Date },
});


const DailyCheck = mongoose.model('daily_check', dailyCheckSchema);
module.exports = { DailyCheck }