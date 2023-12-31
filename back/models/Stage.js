const mongoose = require('mongoose');

const stageSchema = mongoose.Schema({
    student_id:         { type: mongoose.Schema.Types.ObjectId, ref: 'etudiant', required: false },
    enterprise_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'entreprise', required: false },
    tutor_id:           { type: mongoose.Schema.Types.ObjectId, ref: "tuteur", required: false },
    director_id:        { type: mongoose.Schema.Types.ObjectId, ref: "user", required: false },
    begin_date:         { type: Date, required: false },
    end_date:           { type: Date, required: false },
    schedules_per_week: { type: Number, required: false },
    commercial_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    mission_tasks:      { type: String, required: false },
    gratification:      { type: Number, required: false },
    payment_modality:   { type: String, required: false },
    other_advantages:   { type: String, required: false },
    status:             { type: String, required: false },
    school_year:        { type: [String], required: false },
    convention:         { type: String, required: false }, // document lié au stage
    avenant:            { type: String, required: false }, // document lié au stage
    attestation:        { type: String, required: false }, // document lié au stage
    attestation:        { type: String, required: false }, // document lié au stage
    add_by:             { type: mongoose.Schema.Types.ObjectId, ref: "user", required: false },
    added_date:         { type: Date, required: false },
    code_commercial:    { type: mongoose.Schema.Types.ObjectId, ref: "user", required: false },
});

const Stage = mongoose.model('stage', stageSchema);
module.exports = { Stage };