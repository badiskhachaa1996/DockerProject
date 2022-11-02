const mongoose = require('mongoose');

const inTimeSchema = mongoose.Schema({
    user_id:            { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    ip_adress:          { type: String, required: false }, //Adresse ip de l'utilisateur
    date_of_the_day:    { type: Date, required: false }, //Stoque la date du jour sans l'heure
    in_date:            { type: Date, required: false },
    out_date:           { type: Date, required: false },
    in_location:        { type: String, required: false },
    out_location:       { type: String, required: false },
    statut:             { type: String, required: false },
    ip_ref:             { type: mongoose.Schema.Types.ObjectId, required: false }, //reference à _id de l'objet IpAdress.js
});

const InTime = mongoose.model('intime', inTimeSchema);
module.exports = { InTime };