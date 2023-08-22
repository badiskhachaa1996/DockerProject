const express = require("express");
const { Annonce } = require("../models/Annonce");
const { CvType } = require("../models/CvType");
const app = express();
app.disable("x-powered-by");
const { Matching } = require("./../models/matching");

app.post('/create', (req, res) => {
    let event = new Matching({
        ...req.body
    })
    event.save().then(doc => {
        Matching.findById(doc._id).populate('offre_id').populate('matcher_id').populate({ path: 'cv_id', populate: { path: "user_id" } }).then(newDoc => {
            res.send(newDoc)
        })
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

app.get('/getAll', (req, res) => {
    Matching.find().populate('offre_id').populate('matcher_id').populate({ path: 'cv_id', populate: { path: "user_id" } }).then(docs => {
        res.send(docs)
    })
})

app.get('/getAllByOffreID/:offre_id', (req, res) => {
    Matching.find({ offre_id: req.params.offre_id }).populate('offre_id').populate('matcher_id').populate({ path: 'cv_id', populate: { path: "user_id" } }).then(docs => {
        res.send(docs)
    })
})

app.get('/getAllByCVUSERID/:user_id', (req, res) => {
    Matching.find().populate('offre_id').populate('matcher_id').populate({ path: 'cv_id', populate: { path: "user_id" } }).then(docs => {
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
                        r.push({ cv, taux: score * 100 / max_score })
                    })
                    res.send(r)
                })
            })
        }
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
module.exports = app;
