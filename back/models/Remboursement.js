const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const remboursementSchema = new Schema({
    
    cree_le: { type: Date, required: true },
    cree_par: { type: String, required: true }, 
    motif: { type: String, required: true },
    date_refus: { type: Date, required: false },
    statut: { type: String, required: true },
    civilites: { type: String, required: true },
    prenom: { type: String, required: true , trim:true},
    nom: { type: String, required: true , trim:true},

    ecole: { type: String, required: true },
    formation: { type: String, required: true },
    annee_scolaire: { type: String, required: true },
    date_naissance: { type: Date, required: true },
    pays_residence: { type: String, required: true },
    nationalite: { type: String, required: true },
    montant_etu: { type: Number, required: true },
    modalite_etu: { type: String, required: true },
    date_paiement_etu: { type: Date, required: true },
    pdetail_etu: { type: String, required: true },
    montant_rem: { type: Number, required: true },
    modalite_rem: { type: String, required: true },
    date_remboursment_fictif: { type: Date, required: true },
    date_remboursement: { type: Date, required: true },
    pdetail_rem: { type: String, required: true },
    nom_doc: { type: String, required: true },
    lien_doc: { type: String, required: true },
    ajoute_par_doc: { type: String, required: true }, 
    ajoute_le_doc: { type: Date, required: true },
    num_doc: { type: Number, required: true }
});


const Remboursement = mongoose.model('remboursement', remboursementSchema);
module.exports = { Remboursement }; 