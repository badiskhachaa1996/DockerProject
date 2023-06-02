const mongoose = require('mongoose');

const dailyCheckSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    today: { type: Date, required: true },
    check_in: { type: Number, required: false },
    pause: { type: [{ in: { type: Number, required: false }, out: { type: Number, required: false } }], required: false },
    cra: { type: [{ task: { type: String, required: false }, number_minutes: { type: Number, required: false } }], required: false },
    is_anticipated: { type: Boolean, required: false },
    check_out: { type: Number, required: false },
});

const DailyCheck = mongoose.model('daily_check', dailyCheckSchema);
module.exports = { DailyCheck }