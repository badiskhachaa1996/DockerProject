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
module.exports = app;