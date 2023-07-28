const express = require("express");
const app = express();
const { Project } = require("./../models/project/ProjectV2");
const { Task } = require("./../models/project/Task");



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


//PARTIE TACHES 


// create new task
app.post("/post-task", (req, res, next) => {
    const task = new Task({ ...req.body });

    task.save()
    .then((taskCreated) => { res.status(201).json({ task: taskCreated, success: 'Tâche créée' }); })
    .catch((error) => { console.log(error); res.status(500).send({ error: 'Impossible de créer une nouvelle tâche' }); });
});

// get tasks by id project
app.get("/get-tasks/:id", (req, res, next) => {
    console.log(req.params.id);
    Task.find({ project_id: req.params.id })?.populate('project_id')?.populate('attribuate_to')?.populate('creator_id')
    .then((tasksFromDb) => { res.status(200).send(tasksFromDb) })
    .catch((error) => { console.log(error); res.status(500).json({ error: 'Impossible de récuperé la liste des tâches' }); });
});





module.exports = app;