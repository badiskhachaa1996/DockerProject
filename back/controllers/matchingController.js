const express = require("express");
const { Annonce } = require("../models/Annonce");
const { CvType } = require("../models/CvType");
const app = express();
app.disable("x-powered-by");
const { Matching } = require("./../models/matching");
const { Ticket } = require("../models/ticket");
const { User } = require("../models/user");
const { Service } = require("../models/service");
const { Sujet } = require("../models/sujet");

app.post('/create', (req, res) => {
    Matching.findOne({ offre_id: req.body.offre_id, cv_id: req.body.cv_id }).then(match => {
        if (match) {
            res.status(400).send(match)
        } else {
            let event = new Matching({
                ...req.body,
                date_creation: new Date()
            })
            event.save().then(doc => {
                Matching.findById(doc._id).populate({ path: 'offre_id', populate: { path: 'entreprise_id' } }).populate({ path: 'cv_id', populate: { path: 'user_id' } }).then(newMatching => {
                    let ent_name = newMatching?.offre_id?.entreprise_name
                    if (!ent_name)
                        ent_name = newMatching?.offre_id?.entreprise_id?.r_sociale
                    if (event?.accepted)
                        User.findById(req.body.created_by).then(auteur => {
                            Service.findOne({ label: 'Commercial' }).then(s => {
                                if (s) Sujet.findOne({ service_id: s._id, label: 'iMatch' }).then(sujet => {
                                    if (sujet && (!auteur || auteur.type == 'CEO Entreprise' || auteur.type == 'Entreprise' || auteur.type == 'Tuteur'))
                                        createTicket(req.body?.created_by,
                                            `L'entreprise ${ent_name} a fait un match avec le candidat ${newMatching.cv_id.user_id.firstname} ${newMatching.cv_id.user_id.lastname} pour l'offre ${newMatching.offre_id.custom_id} le ${new Date().toLocaleDateString()}`, sujet, 'Matching - Entreprise')
                                    else if (sujet && auteur && (auteur.type == 'Commercial' || auteur.role == 'Admin'))
                                        createTicket(req.body?.created_by,
                                            `${auteur?.firstname} ${auteur?.lastname} a fait un match entre le candidat ${newMatching.cv_id.user_id.firstname} ${newMatching.cv_id.user_id.lastname} et l'offre ${newMatching.offre_id.custom_id} le ${new Date().toLocaleDateString()}`, sujet, 'Matching - Commercial', auteur._id)
                                    else if (sujet && auteur && (auteur.type == 'Initial' || auteur.type == 'Alternant' || auteur.type == 'Prospect' || auteur.type.startWith('Externe')))
                                        createTicket(req.body?.created_by,
                                            `Le candidat ${auteur?.firstname} ${auteur?.lastname} a fait un match entre pour l'offre ${newMatching.offre_id.custom_id} le ${new Date().toLocaleDateString()}`, sujet, 'Matching - Candidat')
                                })
                            })
                        })
                    res.send(newMatching)
                })
            })


        }
    })

})

app.put('/update/:id', (req, res) => {
    Matching.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true }).populate('offre_id').populate('matcher_id').populate({ path: 'cv_id', populate: { path: "user_id" } }).then(doc => {
        res.send(doc)
    })
})

app.get('/getByID/:id', (req, res) => {
    Matching.findById(req.params.id).populate('offre_id').populate('matcher_id').populate({ path: 'cv_id', populate: { path: "user_id" } }).then(doc => {
        res.send(doc)
    })
})


app.delete('/delete/:id', (req, res) => {
    Matching.findByIdAndDelete(req.params.id).populate('offre_id').populate('matcher_id').populate({ path: 'cv_id', populate: { path: "user_id" } }).then(doc => {
        res.send(doc)
    })
})

app.get('/getAll', (req, res) => {
    Matching.find().populate('offre_id').populate('matcher_id').populate({ path: 'cv_id', populate: { path: "user_id" } }).then(docs => {
        res.send(docs)
    })
})

app.get('/getAllByOffreID/:offre_id', (req, res) => {
    Matching.find({ offre_id: req.params.offre_id, accepted: true }).populate('offre_id').populate('matcher_id').populate({ path: 'cv_id', populate: { path: "user_id" } }).then(docs => {
        res.send(docs)
    })
})

app.get('/getAllByCVUSERID/:user_id', (req, res) => {
    Matching.find().populate({ path: 'offre_id', populate: { path: "competences" } }).populate({ path: 'offre_id', populate: { path: "profil" } }).populate('matcher_id').populate({ path: 'cv_id', populate: { path: "user_id" } }).then(docs => {
        let r = []
        docs.forEach(d => {
            if (d?.cv_id?.user_id?._id == req.params.user_id)
                r.push(d)
        })
        res.send(r)
    })
})

app.get('/generateMatchingV1/:offre_id', (req, res) => {
    var r = []
    Annonce.findById(req.params.offre_id, {}, {}).populate('competences').then(offre => {
        if (offre) {
            Matching.find({ offre_id: req.params.offre_id }).populate('cv_id').then(match => {
                let listIds = []
                match.forEach(m => {
                    listIds.push(m.cv_id.user_id)
                })
                CvType.find({ user_id: { $nin: listIds } }).populate('user_id').populate('competences').then(resultat => {
                    resultat.forEach(cv => {
                        let score = 0
                        let max_score = 0
                        offre.competences.forEach(skill => {
                            if (customIncludes(cv.competences, skill))
                                score += 1
                        })
                        max_score += offre.competences.length
                        offre.outils.forEach(tool => {
                            if (cv.outils.includes(tool))
                                score += 1
                        })
                        max_score += offre.outils.length
                        let result = score * 100 / max_score
                        if (score == 0 && max_score == 0)
                            result = 0
                        r.push({ cv_id: cv, taux: result })
                    })
                    Matching.find({ offre_id: req.params.offre_id, favoris: true }).populate('offre_id').populate('matcher_id').populate({ path: 'cv_id', populate: { path: "user_id" } }).then(matchF => {
                        let re = matchF.concat(r)
                        Matching.find({ offre_id: req.params.offre_id, accepted: false, favoris: false }).populate('offre_id').populate('matcher_id').populate({ path: 'cv_id', populate: { path: "user_id" } }).then(match => {
                            let re2 = re.concat(match)
                            res.send(re2)
                        })
                    })


                })
            })
        }
    })
})

app.get('/generateMatchingV1USERID/:user_id', (req, res) => {
    CvType.findOne({ user_id: req.params?.user_id }).then(cv => {
        Matching.find({ cv_id: cv._id }).populate('cv_id').populate({ path: 'offre_id', populate: 'entreprise_id' }).populate('matcher_id').populate({ path: 'offre_id', populate: 'competences' }).populate({ path: 'offre_id', populate: 'user_id' }).then(match => {
            match.forEach(m => {
                let score = 0
                let max_score = 0
                m.offre_id.competences.forEach(skill => {
                    if (customIncludes(cv.competences, skill))
                        score += 1
                })
                max_score += m.offre_id.competences.length
                m.taux = score * 100 / max_score
                console.log(m.taux)
            })
            res.send(match)
        })
    })

})

app.get('/getMatchingByUserAndEntreprise/:user_id/:entreprise_id', (req, res) => {
    CvType.findOne({ user_id: req.params?.user_id }).then(cv => {
        Matching.find({ cv_id: cv._id }).populate('cv_id').populate({ path: 'offre_id', populate: 'entreprise_id' }).populate({ path: 'offre_id', populate: 'competences' }).populate({ path: 'offre_id', populate: 'user_id' }).then(match => {
            let r = []
            match.forEach(m => {
                if (m?.offre_id?.entreprise_id?._id && m?.offre_id?.entreprise_id?._id == req.params.entreprise_id) {
                    let score = 0
                    let max_score = 0
                    m.offre_id.competences.forEach(skill => {
                        if (customIncludes(cv.competences, skill))
                            score += 1
                    })
                    max_score += m.offre_id.competences.length
                    m.taux = score * 100 / max_score
                    r.push(m)
                }
            })
            res.send(r)
        })
    })

})

function customIncludes(listObj, Obj) {
    let r = false
    listObj.forEach(buffer => {
        if (buffer._id.toString() == Obj._id.toString()) {
            r = true
        }
    })
    return r
}
function createTicket(created_by, description, sujet, resum, agent_id) {
    function entierAleatoire(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    Ticket.find({ sujet_id: sujet._id }).then(tkt => {
        var lengTicket = tkt.length + 1
        //Generation Custom ID
        let id = ""
        let d = new Date()
        let month = (d.getUTCMonth() + 1).toString()
        if (d.getUTCMonth() + 1 < 10)
            month = "0" + month
        let day = (d.getUTCDate()).toString()
        if (d.getUTCDate() < 10)
            day = "0" + day
        let year = d.getUTCFullYear().toString().slice(-2);
        while (lengTicket > 1000)
            lengTicket - 1000
        let nb = (lengTicket).toString()
        if (lengTicket < 10)
            nb = "00" + nb
        if (lengTicket < 100)
            nb = "0" + nb


        id = "IGTR" + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString()

        const newTicket = new Ticket({
            resum,
            createur_id: created_by,
            sujet_id: sujet._id,
            description,
            date_ajout: d,
            customid: id,
            agent_id
        });
        newTicket.save((err, doc) => {
        });
    })
}

app.get('/getAllToday', (req, res) => {
    let day = new Date().getDate().toString()
    let month = (new Date().getMonth() + 1).toString()
    let year = new Date().getFullYear().toString()
    console.log(`${year}-${month}-${day}`)
    Matching.find({ date_creation: { $gte: `${year}-${month}-${day}`, $lte: `${year}-${month}-${day} 23:59` } }).populate({ path: 'cv_id', populate: 'user_id' }).populate({ path: 'offre_id', populate: 'entreprise_id' }).populate({ path: 'offre_id', populate: 'competences' }).populate({ path: 'offre_id', populate: 'user_id' }).then(val => {
        res.send(val)
    })
})

app.get('/getAllByDate/:date1/:date2', (req, res) => {
    Matching.find({ date_creation: { $gte: req.params.date1, $lte: req.params.date2 } }).sort({ date_creation: 1 }).populate({ path: 'cv_id', populate: 'user_id' }).populate({ path: 'offre_id', populate: 'entreprise_id' }).populate({ path: 'offre_id', populate: 'competences' }).populate({ path: 'offre_id', populate: 'user_id' }).then(val => {
        res.send(val)
    })
})
module.exports = app;
