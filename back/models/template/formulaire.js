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
    formation2: { type: String },
    /*
        En cas de l'utilisation du populate (voir controllers/template/formulaireController.js ligne 35)
        ref correponds au nom du model mis dans mongoose.model('ecole',schema)

        ecole: { type: mongoose.Schema.Types.ObjectId, ref: 'ecole' },
        formation: { type: mongoose.Schema.Types.ObjectId, ref: 'formation' },
        formation2: { type: mongoose.Schema.Types.ObjectId, ref: 'formation' },
    */

    argumentation: { type: String },
    onBlur: { type: String },
    onInput: { type: String },


});

const TemplateFormulaire = mongoose.model('templateFormulaire', schema);
module.exports = { TemplateFormulaire };