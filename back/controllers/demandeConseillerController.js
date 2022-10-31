const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Demande_conseiller } = require("./../models/demandeConseiller");
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

app.get('/Update/:id', (req, res, next) => {
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


module.exports = app;