//déclaration de la biblio mongoose pour l'utiliser c'est comme un import
const mongoose = require("mongoose");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
const service_schema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    index: {
        type: Number,
        default: 0
    },
    extra1: {
        type: [String],
        default: []
    }, extra2: {
        type: [String],
        default: []
    },
    extraInfo: {
        type: { title1: { type: String, default: "Extra 1" }, placeholder1: { type: String, default: "Choisissez une information" }, title2: { type: String, default: "Extra 2" }, placeholder2: { type: String, default: "Choisissez une information" }, },
        default: { title1: "Extra 1", title2: "Extra 2", placeholder1: "Choisissez une information", placeholder2: "Choisissez une information" }
    }
});
//creation de la table avec le nom Service ( model/classe) à l'aide de la biblio mongoose et son schema
const Service = mongoose.model("service", service_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { Service };
