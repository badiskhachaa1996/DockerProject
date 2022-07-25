const mongoose = require("mongoose");
const rb_sch = new mongoose.Schema({
    matiere_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "matiere",
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    fixed_moy: {
        type: mongoose.Schema.Types.Decimal128
    },
    semestre: {
        type: String,
        required: true,
    },
    isDispensed: {
        type: Boolean,
        default: false
    }
})

const RachatBulletin = mongoose.model("RachatBulletin", rb_sch);
module.exports = { RachatBulletin }; 