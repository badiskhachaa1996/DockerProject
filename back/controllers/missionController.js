const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Mission } = require('./../models/Mission');

//Création d'une mission
app.post("/post-mission", (req, res) => {
    const mission = new Mission({ ...req.body });

    mission.save()
           .then((missionSaved) => { res.status(201).send(missionSaved); })
           .catch((error) => { res.status(400).send(error.message); });
});


//Recuperation de la liste des missions
app.get("/get-missions", (_, res) => {
    Mission.find()
           .then((missions) => { res.status(200).send(missions); })
           .catch((error) => { res.status(500).send(error.message); });
});


//Récuperation d'une mission via on identifiant
app.get("/get-mission", (req, res) => {
    Mission.findById(req.params.missionId)
           .then((mission) => { res.status(200).send(mission); })
           .catch((error) => { res.status(500).send(error.message); });
});

module.exports = app;