const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.disable('x-powered-by');
const { Team } = require('../models/Team');

//Création d'une nouvelle équipe
app.post("/createTeam", (req, res) => {
    const team = new Team({...req.body});

    team.save()
        .then((teamSaved) => { res.status(201).send(teamSaved); })
        .catch((error) => { res.status(400).send(error.message); })
});

//Modification d'une équipe
app.put("/updateTeam", (req, res) => {

    Team.updateOne({_id: req.body._id}, { ...req.body})
        .then((teamUpdated) => { res.status(200).send(teamUpdated); })
        .catch((error) => { res.status(500).send(error.message); })
});

//Récuperation de la liste des équipes
app.get("/get-team", (req, res) => {
    Team.find()
        .then((teams) => { res.status(200).send(teams); })
        .catch((error) => { res.status(500).send(error.message); });
});

//Récuperation d'une équipe via son id
app.get("/get-team/:teamId", (req, res) => {
    Team.findOne({_id: req.params.teamId})
        .then((teams) => { res.status(200).send(teams); })
        .catch((error) => { res.status(500).send(error.message); });
    });

//Récuperation d'une équipe via responsable_id    
app.get("get-team/:responsable_id", (req, res) =>{
    Team.findOne({ responsable_id: req.params.responsable_id})?.populate("responsable_id")
        .then((teams) => { res.status(200).send(teams); })
        .catch((error) => { res.status(500).send(error.message); });
})


module.exports = app;