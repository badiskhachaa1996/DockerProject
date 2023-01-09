const mongoose = require("mongoose");
const rb_sch = new mongoose.Schema({
    formation: {
        type: String,
    },
    age: {
        type: Number
    },
    annee_formation: {
        type: String,
    },
    horaire: {
        type: Number,
        required: true,
    },
    charge: {
        type: Number,
    },
    satisfait_nb_matiere: {
        type: Number,
    },
    satisfait_programme: {
        type: Number,
    },
    satisfait_pedagogie_enseignant: {
        type: Number,
    },
    support: {
        type: Boolean,
    },
    satisfait_support: {
        type: Number,
    },
    satisfait_modes: {
        type: Number,
    },
    satisfait_suivi: {
        type: Number,
    },
    satisfait_locaux: {
        type: Number
    },
    ecole: {
        type: String
    },
    propositions: {
        type: String
    }
})

const QS = mongoose.model("QS", rb_sch);
module.exports = { QS }; 