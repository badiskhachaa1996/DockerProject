const mongoose = require("mongoose");
const rb_sch = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    remarque: {
        type: String,
        required: true,
    },
    mois: {
        type: Number
    },
    year: { type: Number }
})

const RemarqueFacture = mongoose.model("RemarqueFacture", rb_sch);
module.exports = { RemarqueFacture }; 