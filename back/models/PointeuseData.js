const mongoose = require('mongoose');

const schemea = mongoose.Schema({
    serial_number: { type: String, unique: true },
    nb_users: { type: Number },
    nom_appareil: { type: String },
    ip: { type: String },
    mask: { type: String },
    gateway: { type: String },
    firmware: { type: String },
    plateforme: { type: String },
    adresse_mac: { type: String },
    nb_faces: { type: Number },
    nb_fingers: { type: Number },
    users: {
        type: [{
            UID: { type: Number },
            name: { type: String },
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            }
        }]
    }
});

const PointeuseData = mongoose.model('pointeuseData', schemea);
module.exports = { PointeuseData };