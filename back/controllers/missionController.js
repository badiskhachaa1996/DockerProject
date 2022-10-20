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


//Recuperation de la liste des mission d'un utilisateur
app.get("/get-missions-by-user-id/:user_id", (req, res) => {
    Mission.find({ user_id: req.params.user_id })
           .then((missions) => { res.status(200).send(missions); })
           .catch((error) => { res.status(500).send(error.message); });
});


//Recuperation de la liste des mission d'une entreprise
app.get("/get-missions-by-entreprise-id/:entreprise_id", (req, res) => {
    Mission.find({ entreprise_id: req.params.entreprise_id })
           .then((missions) => { res.status(200).send(missions); })
           .catch((error) => { res.status(500).send(error.message); });
});


//Modification d'une mission
app.put("/put-mission", (req, res) => {

    Mission.updateOne({ _id: req.body._id }, { ...req.body } )
           .then((mission) => { res.status(200).send(mission) })
           .catch((error) => { res.status(500).send(error.message) })
});

module.exports = app;