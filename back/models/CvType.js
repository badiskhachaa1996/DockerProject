//importation de la bibliothèque mongoose
const mongoose = require('mongoose');
//creation du schema de la table diplome
const cvTypeSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false, unique: true },
    experiences_pro: {
        type: [{

            date_debut: { type: Date },

            date_fin: { type: Date },

            intitule_experience: { type: String },

            structure: { type: String },

            details: { type: String },

            type: { type: String }

        }], required: false
    },
    competences: { type: [mongoose.Schema.Types.ObjectId], ref: 'competences', required: false },
    outils: { type: [String], required: false },
    langues: { type: [String], required: false },
    video_lien: { type: String, required: false },
    filename: { type: String, required: false },
    education: {
        type: [{

            date_debut: { type: Date },

            date_fin: { type: Date },

            intitule_experience: { type: String },

            structure: { type: String },

            details: { type: String },

            type: { type: String }

        }], required: false
    },
    experiences_associatif: {
        type: [{

            date_debut: { type: Date },

            date_fin: { type: Date },

            intitule_experience: { type: String },

            structure: { type: String },

            details: { type: String },

            type: { type: String }

        }], required: false
    },
    informatique: {
        type: [{

            date_debut: { type: Date },

            date_fin: { type: Date },

            intitule_experience: { type: String },

            structure: { type: String },

            details: { type: String },

            type: { type: String }

        }], required: false
    },
    mobilite_lieu: { type: [String], required: false },
    mobilite_autre: { type: String, required: false, default: "France" },
    date_creation: { type: Date, default: Date.now },
    centre_interets: { type: String, required: false },
    a_propos: { type: String, required: false },
    disponibilite: { type: Date, required: false, default: Date.now },
    createur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    winner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false }, //Commercial ()
    picture: { type: String, required: false },
    isPublic: { type: Boolean, default: true },
    niveau_etude: { type: String },
    last_modified_at: { type: Date },
    source: { type: String, default: 'Interne' },
    taux: { type: Number, default: 0 },
    ecole: { type: String, default: 'espic' },
    profil: { type: mongoose.Schema.Types.ObjectId, ref: 'profiles' },
    showCVPDF: { type: Boolean, default: false }
});

//creation de la table avec le nom Diplome ( model/classe) à l'aide de la biblio mongoose et son schema
const CvType = mongoose.model('cv_type', cvTypeSchema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { CvType };
