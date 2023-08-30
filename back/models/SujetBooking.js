const mongoose = require("mongoose");

const sujetBooking = new mongoose.Schema({
  titre_sujet:    { type: String, required: false },
  duree:          { type: String, required: false},
  canal:          { type: [String], required: false, default: []},
  description:    { type: String, required: false}, 
  active:         { type: Boolean, required: false},
  membre:         { type: [mongoose.Schema.Types.ObjectId], ref: "user", default: []},
 });

const SujetBooking = mongoose.model('sujetBooking', sujetBooking);
module.exports = { SujetBooking };
