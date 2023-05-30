const mongoose = require('mongoose');

const admissionFormDubaiSchema = mongoose.Schema({
    full_name:              { type: String, required: false },
    email_address:          { type: String, required: false },
    phone:
    {
        type:
        {
            countryCode: { type: String },
            dialCode: { type: String },
            e164Number: { type: String },
            internationalNumber: { type: String },
            nationalNumber: { type: String },
            number: { type: String },
        },
        required: false
    },
    whatsapp:
    {
        type:
        {
            countryCode: { type: String },
            dialCode: { type: String },
            e164Number: { type: String },
            internationalNumber: { type: String },
            nationalNumber: { type: String },
            number: { type: String },
        },
        required: false
    },
    nationality:            { type: String, required: false },
    country_of_residence:   { type: String, required: false },
    last_diploma:           { type: String, required: false },
    chosen_program:         { type: String, required: false },
    intake :                { type: String, required: false },
    date:                   { type: Date, required: false },
});

const AdmissionFormDubai = mongoose.model('admission_form_dubai', admissionFormDubaiSchema);
module.exports = { AdmissionFormDubai };