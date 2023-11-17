const express = require("express");
const app = express();
const nodemailer = require('nodemailer');
const {Evaluation} = require("./../models/evaluation");

app.post("/create-evaluation", (req, res) => {
    const evaluation = new Evaluation({ ...req.body });

    evaluation.save()
    .then((evaluationCreated) => { res.status(201).json({ evaluation: evaluationCreated, success: 'Evaluation crée' }) })
    .catch((error) => { console.error(error); res.status(500).json({ error: 'Impossible de créer evaluation, si le problème persite veuillez créer un ticket au service IMS' }); })
});
app.get("/recuperation", (req, res) => {
    Evaluation.find()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("impossible de récupérer levaluation");
    })});

    app.delete("/delete/:id", (req, res, next) => {
        Evaluation.deleteOne({ _id: req.params.id })
        .then((response) => { res.status(200).json({ success: 'evaluation supprimé' }) })
        .catch((error) => {console.error(error); res.status(400).json({ error: 'Impossible de supprimer cette evaluation' });})
    });


    app.put("/put-evaluation", (req, res, next) => {
        const evaluation = new Evaluation({ ...req.body });
    
        Evaluation.updateOne({ _id: evaluation._id }, { ...req.body })
        .then((evaluation) => { res.status(201).json({ evaluation: evaluation, success: 'evaluation mis à jour'}); })
        .catch((error) => { console.error(error); res.status(400).json({ error: 'Impossible de mettre à jour l evaluation, si le problème persite veuillez créer un ticket au service IMS' }); });
    });
module.exports = app;