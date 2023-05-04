//déclaration de la biblio mongoose pour l'utiliser c'est comme un import.
const mongoose = require("mongoose");

// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema.
const schema = new mongoose.Schema({

    custom_id: { type: String },
    date_creation: { type: Date },
    prenom: { type: String },
    nom: { type: String },
    email: { type: String },
    pays: { type: String },
    campus: { type: String },
    ecole: { type: String },
    formation: { type: String },
    rentree_scolaire: { type: String },
    etat_contrat: { type: String, default: 'A la recherche' },
    inscription: { type: String },
    documents_optionnel: {
        type: [{ nom: String, path: String }],
        default: []
    },
    documents_requis: {
        type: [{ nom: String, path: String }],
        default: [
            { nom: 'CV', path: null },
            { nom: "Titre de séjour", value: null },
            { nom: "Pièce d'identité ou passeport", value: null },
            { nom: "Dernier diplome obtenu", value: null },

        ]
    },
    code_commercial: { type: String },
    civilite: { type: String },
    date_naissance: { type: Date },
    nationalite: { type: String },
    telephone: { type: String },
    indicatif: { type: String },
    whatsapp: { type: String },
    indicatif_whatsapp: { type: String },
    isPMR: { type: Boolean, default: false },
    rue: { type: String },
    numero: { type: String },
    postal: { type: String },
    ville: { type: String },
    date_contrat: { type: Date },
    entreprise: { type: String },
    adresse_entreprise: { type: String },
    telephone_entreprise: { type: String },
    mail_entreprise: { type: String },
});

//creation de la table anneeScolaire avec le nom AnneeScolaire ( model/classe) à l'aide de la biblio mongoose et son schema
const AlternantsPartenaire = mongoose.model("alternantsPartenaire", schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { AlternantsPartenaire };
