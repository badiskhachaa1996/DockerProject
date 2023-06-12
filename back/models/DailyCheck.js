const mongoose = require('mongoose');

const dailyCheckSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    today: { type: String, required: true },
    check_in: { type: Date, required: false },
    pause: { type: [{ in: { type: Date, required: false }, out: { type: Date, required: false } }], required: false },
    isInPause: { type: Boolean, required: false },
    cra: { type: [{ task: { type: String, required: false }, number_minutes: { type: Number, required: false } }], required: false },
    is_anticipated: { type: Boolean, required: false },
    check_out: { type: Date, required: false },
});


const DailyCheck = mongoose.model('daily_check', dailyCheckSchema);
module.exports = { DailyCheck }