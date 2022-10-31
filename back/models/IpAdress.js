const mongoose = require('mongoose');

const ipAdressSchema = mongoose.Schema({
    adress:     { type: String, required: false },
    location:   { type: String, required: false },
});

const IpAdress = mongoose.model('ip_adress', ipAdressSchema);
module.exports = { IpAdress };