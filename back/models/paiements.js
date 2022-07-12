const mongoose = require('mongoose');

const paiement_schema = new mongoose.Schema({
    inscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "prospect",
        required: true
    },
    typePaiement: {
        type: string,
        required: true
    },
    
    nomDonneurDordre: {
        type: String,
        required: true
    },
    numVirement: {
        type: String,
        required: true
    },
    datePaiement: {
        type: date,
        required: true
    },
    paysVirement: {
        type: String,
        required: true
    },
    montantVirement: {
        type: String,
        required: true,
    },
    remarque: {
        type: String,
    },

    statut_paiement: {
        type: String,
        required: true,
        default: "en attente de validation"
    }



});
const Paiements = mongoose.model("paiements", paiement_schema);
module.exports = { Paiements };