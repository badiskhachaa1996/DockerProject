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
        //Trouver toutes les séances de l'étudiant
        //Si
        Etudiant.find().populate('user_id').then(etudiants => {
            let dicAbsence = {}
            let d3J = new Date()
            d3J.setDate(d3J.getDate() + 3)
            etudiants.forEach(e => {
                Seance.find({ classe_id: e.classe_id, date_fin: { $lt: new Date() }, date_debut: { $gt: d3J } }).then(seances => {
                    seances.forEach(s => {
                        Presence.findOne({ seance_id: s._id, user_id: e.user_id._id }).then(p => {
                            if (!p || !p.isPresent) {
                                //Envoie de mail Attention vous avez été noté
                                console.log(s, e)
                            }
                        })
                    })
                })
            })
        })
    })