const mongoose = require('mongoose');

const admissionFormDubaiSchema = mongoose.Schema({
    full_name:              { type: String, required: false },
    email_address:          { type: String, required: false },
    phone:
    {
        type:
        {
            country_code:   { type: String },
            phone_number:   { type: String },
        },
        required: false
    },
    whatsapp:
    {
        type:
        {
            country_code:   { type: String },
            phone_number:   { type: String },
        },
        required: false
    },
    nationality:            { type: String, required: false },
    country_of_residence:   { type: String, required: false },
    last_diploma:           { type: String, required: false },
    chosen_program:         { type: String, required: false },
    Intake :                { type: String, required: false },
});

const AdmissionFormDubai = mongoose.model('admission_form_dubai', admissionFormDubaiSchema);
module.exports = { AdmissionFormDubai };