//declaration de la bibliothèque mongodb
const mongoose = require("mongoose");
//creation du schema de table campus
const campusSchema = mongoose.createSchema({
    libelle: { type: String, required: true },
    ecole_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ecole", required: true },
    ville: { type: String, required: true },
    pays: { type: String, required: true },
    email: { type: String, required: true },
    adresse: { type: String, required: true },
    site: { type: String, required: true }
});

//Creation de la table campus et export du model Campus
module.exports = mongoose.model("Campus", campusSchema);