const mongoose = require('mongoose');

const inTimeSchema = mongoose.Schema({
    user_id:                        { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    in_ip_adress:                   { type: String, required: false }, //Adresse ip de l'utilisateur
    out_ip_adress:                  { type: String, required: false }, //Adresse ip de l'utilisateur
    date_of_the_day:                { type: String, required: false }, //Stoque la date du jour sans l'heure
    in_date:                        { type: Date, required: false },
    out_date:                       { type: Date, required: false },
    statut:                         { type: String, required: false },
    isCheckable:                    { type: Boolean, required: false },
    craIsValidate:                  { type: Boolean, required: false },
    // principale_activity_details:    { type: String, required: false },
    activity_details:               { type: [String], required: false },
    number_of_hour:                 { type: Number, required: false },
});

const InTime = mongoose.model('intime', inTimeSchema);
module.exports = { InTime };