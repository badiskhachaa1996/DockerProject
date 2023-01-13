const express = require("express");
const app = express(); //à travers ça je peux faire la creation des Sujets
const { Project } = require("./../models/project/Project");
const { Task } = require("./../models/project/Task");
const nodemailer = require('nodemailer');
const { json } = require("body-parser");
app.disable("x-powered-by");

if(process.argv[2]) {
    let argProd = process.argv[2]
    if (argProd.includes('dev')) {
        origin = ["https://t.dev.estya.com"]
    } else (
        origin = ["https://ticket.estya.com", "https://estya.com", "https://adgeducations.com"]
    )
}

const transporterEH = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'contact@eduhorizons.com',
        pass: 'CeHs2022$',
    },
});

/** Project part */

// create new project
app.post("/post-project", (req, res, next) => {
    const project = new Project({ ...req.body });

    // envoi du projet en base de données
    Project.insertOne({ project })
    .then((projectCreated) => { res.status(201).json({ project: projectCreated, success: 'Projet crée' }) })
    .catch((error) => { console.log(error); res.status(500).json({ error: 'Impossible de créer le projet, si le problème persite veuillez créer un ticket au service IMS' }); })
});


// update project
app.put("/put-project", (req, res, next) => {
    const project = new Project({ ...req.body });

    Project.updateOne({ _id: project._id }, { project })
    .then((project) => { res.status(201).json({ project: project, success: 'Projet mis à jour'}); })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de mettre à jour le projet, si le problème persite veuillez créer un ticket au service IMS' }); });
});


// get all projects
app.get('get-projects', (req, res, next) => {
    Project.find()
    .then((projects) => { res.status(200).json({ projects: projects, success: 'Projets récuperés'}) })
    .catch((error) => { console.log(error); res.status(500).json({ error: 'Impossible de récuperer les projets' }); })
});


// get project by id project
app.get('/get-project/:id', (req, res, next) => {
    Project.findOne({ _id: req.params.id })
    .then((project) => { res.status(200);json({ project: project, success: 'Projet récuperé '}); })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de récuperer le projet'}); })
});



/** Task part */

// create new task
app.post("/post-task", (req, res, next) => {
    const task = new Task({ ...req.body });

    Task.insertOne({ task })
    .then((taskCreated) => { res.status(201).json({ task: taskCreated, success: 'Tâche créée' }); })
    .catch((error) => { console.log(error); res.status(500).send({ error: 'Impossible de créer une nouvelle tâche' }); });
});


// update task 
app.put("/put-task", (req, res, next) => {
    const task = new Task({ ...req.body });

    Task.updateOne({ _id: task._id }, { task })
    .then((taskUpdated) => { res.status(201).json({ task: taskUpdated, success: 'Tâche mis à jour' }); })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de mettre à jour cette tâche' }); });
});


// get all Tasks
app.get("/get-tasks", (req, res, next) => {
    Task.find()
    .then((tasksFromDb) => { res.status(200).json({ tasks: tasksFromDb, success: 'Tâches récuperées' }) })
    .catch((error) => { console.log(error); res.status(500).json({ error: 'Impossible de récuperé la liste des tâches' }); });
});


// get task by id task
app.get("/get-task/:id", (req, res, next) => {
    Task.findOne({ _id: req.params.id })
    .then((taskFromDb) => { res.status(200).json({ task: taskFromDb, success: 'Tâche récuperée' }) })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de récuperé la tâche' }); });
});


// get tasks by id project
app.get("/get-tasks/:id", (req, res, next) => {
    Task.find({ project_id: req.params.id })
    .then((tasksFromDb) => { res.status(200).json({ tasks: tasksFromDb, success: 'Tâches récuperées' }) })
    .catch((error) => { console.log(error); res.status(500).json({ error: 'Impossible de récuperé la liste des tâches' }); });
});


module.exports = app;