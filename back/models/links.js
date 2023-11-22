const mongoose = require('mongoose');
const linksSchema = mongoose.Schema({
    user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    classe:{ type:String, required: false},
    nom: { type: String, required: true },
    lien: { type: String, required: true },
 
});

const Links = mongoose.model('links', linksSchema);
module.exports = { Links };