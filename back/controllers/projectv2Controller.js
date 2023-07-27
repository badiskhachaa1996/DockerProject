const express = require("express");
const app = express();
const { Project } = require("./../models/project/ProjectV2")



//CREATION PROJECT
app.post("/create-project", (req, res) => {
    console.log("je suuuuis la")
    const project = new Project({ ...req.body });

    project.save()
    .then((projectCreated) => { res.status(201).json({ project: projectCreated, success: 'Projet crée' }) })
    .catch((error) => { console.log(error); res.status(500).json({ error: 'Impossible de créer le projet, si le problème persite veuillez créer un ticket au service IMS' }); })
});

//recuperation des projet

app.get("/recuperation", (req, res) => {
    Project.find()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("impossible de récupérer les utilisateurs");
    })});


// suppression d'un projet
app.delete("/delete/:id", (req, res, next) => {
    Project.deleteOne({ _id: req.params.id })
    .then((response) => { res.status(200).json({ success: 'project supprimé' }) })
    .catch((error) => {console.log(error); res.status(400).json({ error: 'Impossible de supprimer ce project' });})
});

module.exports = app;