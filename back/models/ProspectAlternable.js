const mongoose = require('mongoose');
const prospectAlternableSchema = mongoose.Schema({
    user_id:                { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    date_naissance:         { type: Date, required: false },
    nir:                    { type: String, required: false },
    commune_naissance:      { type: String, required: false },
    isHandicap:             { type: Boolean, required: false },
    last_title_prepared:    { type: String, required: false },
    title_in_progress:      { type: String, required: false },
    highest_title:          { type: String, required: false },
    commercial_id:          { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
});

// création de la collection prospect_alternables
const ProspectAlternable = mongoose.model('prospect_alternable', prospectAlternableSchema);
// export du modèle pour l'utiliser dans les contrôleurs
module.exports = { ProspectAlternable };