const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    pWR:        { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    pFFR:       { type: mongoose.Schema.Types.ObjectId, ref: "user", required: false },
    isValidate: { type: Boolean, required: false },
});

const Reservation = mongoose.model("reservation", reservationSchema);
module.exports = { Reservation };