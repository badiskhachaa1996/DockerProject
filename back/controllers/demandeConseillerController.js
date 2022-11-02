const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Demande_conseiller } = require("./../models/demandeConseiller");
const { TeamCommercial } = require('./../models/teamCommercial')
app.post("/create", (req, res, next) => {

    //création d'un nvx event
    let dc = new Demande_conseiller(
        {
            ...req.body
        });

    dc.save()
        .then((eventSaved) => {
            res.status(201).send(eventSaved)
        })
        .catch((error) => {
            res.status(400).json({ msg: "Erreur réessayez plus tard", error })
        });
})

app.get('/findbyStudentID/:id', (req, res, next) => {
    Demande_conseiller.findOne({ student_id: req.params.id }).populate('conseiller_id')
        .then((result) => { res.status(200).send(result); })
        .catch((error) => { req.status(500).send(error); });
})

app.post('/update/:id', (req, res, next) => {
    Demande_conseiller.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true }).populate('conseiller_id').populate('student_id')
        .then((result) => { res.status(200).send(result); })
        .catch((error) => { req.status(500).send(error); });
})

app.get('/delete/:id', (req, res, next) => {
    Demande_conseiller.findByIdAndDelete(req.params.id).populate('conseiller_id').populate('student_id')
        .then((result) => { res.status(200).send(result); })
        .catch((error) => { req.status(500).send(error); });
})
app.get("/getAll", (req, res, next) => {
    Demande_conseiller.find({ archived: false, activated: false }).populate('conseiller_id').populate('student_id')
        .then((result) => { res.status(200).send(result); })
        .catch((error) => { req.status(500).send(error); });
})

app.get("/getAllByTeamCommercialID/:team_id", (req, res, next) => {
    TeamCommercial.findById(req.params.team_id)
        .then(team => {
            let r = []
            r.push(team.owner_id)
            r = r.concat(team.team_id)
            Demande_conseiller.find({ archived: false, activated: true, conseiller_id: { $in: r } }).populate('conseiller_id').populate('student_id')
                .then((result) => { res.status(200).send(result); })
                .catch((error) => { req.status(500).send(error); });
        })
        .catch((error) => {
            console.error(error)
            res.status(500).send(error)
        })
})
app.get("/getAllWaitingByTeamCommercialID/:team_id", (req, res, next) => {
    TeamCommercial.findById(req.params.team_id)
        .then(team => {
            let r = []
            r.push(team.owner_id)
            r = r.concat(team.team_id)
            Demande_conseiller.find({ archived: false, activated: false, conseiller_id: { $in: r } }).populate('conseiller_id').populate('student_id')
                .then((result) => { res.status(200).send(result); })
                .catch((error) => { req.status(500).send(error); });
        })
        .catch((error) => {
            console.error(error)
            res.status(500).send(error)
        })
})


module.exports = app;