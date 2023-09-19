const mongoose = require('mongoose');

const schema = mongoose.Schema({
    date: { type: Date },
    texte: { type: String },
    telephone: { type: String },
    dropdown: { type: String },
    multiSelect: { type: [String] },
    multiSelectMax3: { type: [String] },
    selectButton: { type: String },
    textArea: { type: String },
    sens_vie: { type: String },

    ecole: { type: String },
    formation: { type: String },

    argumentation: { type: String },
    onBlur: { type: String },
    onInput: { type: String },
    formation2: { type: String },
});

const TemplateFormulaire = mongoose.model('templateFormulaire', schema);
module.exports = { TemplateFormulaire };