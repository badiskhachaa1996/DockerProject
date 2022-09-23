//Nettoyer les Objets du type Etudiant ou Formateur qui n'ont plus l'objet user

const { User } = require("../models/user");
const { Etudiant } = require('../models/etudiant')
const { Presence } = require('../models/presence')
const { Seance } = require('../models/seance')
const mongoose = require("mongoose");
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        //Etudiant
        Etudiant.find().populate('user_id').then(etudiants => {
            etudiants.forEach(etu => {
                if (etu.user_id == null) {
                    Etudiant.findByIdAndRemove(etu._id)
                }
            })
        })

        //Formateur
        Formateur.find().populate('user_id').then(formateurs => {
            formateurs.forEach(f => {
                if (f.user_id == null) {
                    Formateur.findByIdAndRemove(f._id)
                }
            })
        })

        //Prospect
        Prospect.find().populate('user_id').then(prospects => {
            prospects.forEach(p => {
                if (p.user_id == null) {
                    Prospect.findByIdAndRemove(p._id)
                }
            })
        })
    })