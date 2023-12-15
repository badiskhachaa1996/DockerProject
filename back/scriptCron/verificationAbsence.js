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
        setTimeout(() => {
            process.exit()

        }, 300000)
        Etudiant.find().populate('user_id').then(etudiants => {
            let dicAbsence = {}
            let d3J = new Date()
            d3J.setDate(d3J.getDate() + 3)
            etudiants.forEach(e => {
                Seance.find({ classe_id: e.classe_id, date_fin: { $lt: new Date() }, date_debut: { $gt: d3J } }).then(seances => {
                    seances.forEach(s => {
                        Presence.findOne({ seance_id: s._id, user_id: e.user_id._id }).then(p => {
                            if (!p || !p.isPresent) {
                                //Envoie de mail Attention vous avez été noté Absent veuillez justifié
                                sendEmailForJustify(e, s)
                            }
                        })
                    })
                })
            })
        })
        Etudiant.find().populate('user_id').then(etudiants => {
            etudiants.forEach(e => {
                let dicAbsence = {}
                Seance.find({ classe_id: e.classe_id, date_fin: { $lt: new Date() } }).then(seances => {
                    seances.forEach(s => {
                        Presence.findOne({ seance_id: s._id, user_id: e.user_id._id }).then(p => {
                            if (!p || !p.isPresent) {
                                if (dicAbsence[s.matiere_id]) {
                                    dicAbsence[s.matiere_id] += 1
                                } else {
                                    dicAbsence[s.matiere_id] = 1
                                }
                            }
                            if (s._id == seances[seance.length - 1]._id) {
                                Etudiant.findByIdAndUpdate(e._id, dicAbsence, { new: true }, (err, val) => {
                                    if (val._id == etudiants[etudiants.length - 1]._id) {
                                        //Envoie de mail Attention vous avez été noté Absent veuillez justifié
                                        sendEmailWarningFor2AbsencesInModule(val)
                                    }
                                })
                            }
                        })
                    })
                })

            })
        })
    })

function sendEmailForJustify(etudiant, seance) {

}
function sendEmailWarningFor2AbsencesInModule(etudiant) {

}