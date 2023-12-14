const express = require("express");
const app = express(); //à travers ça je peux faire la creation des Sujets
//const { Project } = require("./../models/project/Project");
const { Task } = require("./../models/project/Task");
const nodemailer = require('nodemailer');
const { json } = require("body-parser");
app.disable("x-powered-by");

if (process.argv[2]) {
    let argProd = process.argv[2]
    if (argProd.includes('dev')) {
        origin = ["https://141.94.71.25"]
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
    project.save()
        .then((projectCreated) => { res.status(201).json({ project: projectCreated, success: 'Projet crée' }) })
        .catch((error) => { console.error(error); res.status(500).json({ error: 'Impossible de créer le projet, si le problème persite veuillez créer un ticket au service IMS' }); })
});


// update project
app.put("/put-project", (req, res, next) => {
    const project = new Project({ ...req.body });

    Project.updateOne({ _id: project._id }, { ...req.body })
        .then((project) => { res.status(201).json({ project: project, success: 'Projet mis à jour' }); })
        .catch((error) => { console.error(error); res.status(400).json({ error: 'Impossible de mettre à jour le projet, si le problème persite veuillez créer un ticket au service IMS' }); });
});


// get all projects
app.get('/get-projects', (req, res, next) => {
    Project.find()?.populate('creator_id')
        .then((projects) => { res.status(200).send(projects) })
        .catch((error) => { console.error(error); res.status(500).json({ error: 'Impossible de récuperer les projets' }); })
});


// get project by id project
app.get('/get-project/:id', (req, res, next) => {
    Project.findOne({ _id: req.params.id })?.populate('creator_id')
        .then((project) => { res.status(200).send(project); })
        .catch((error) => { console.error(error); res.status(400).json({ error: 'Impossible de récuperer le projet' }); })
});



/** Task part */

// create new task
app.post("/post-task", (req, res, next) => {
    const task = new Task({ ...req.body });

    task.save()
        .then((taskCreated) => { res.status(201).json({ task: taskCreated, success: 'Tâche créée' }); })
        .catch((error) => { console.error(error); res.status(500).send({ error: 'Impossible de créer une nouvelle tâche' }); });
});


// update task 
app.put("/put-task", (req, res, next) => {
    const task = new Task({ ...req.body });
    Task.findByIdAndUpdate(task._id, { ...req.body }, { new: true })
        .then((taskUpdated) => { res.status(201).json(taskUpdated); })
        .catch((error) => { console.error(error); res.status(400).json({ error: 'Impossible de mettre à jour cette tâche' }); });
});


// get all Tasks
app.get("/get-tasks", (req, res, next) => {
    Task.find()?.populate('project_id')?.populate('attribuate_to')
        .then((tasksFromDb) => { res.status(200).send(tasksFromDb) })
        .catch((error) => { console.error(error); res.status(500).json({ error: 'Impossible de récuperé la liste des tâches' }); });
});


// get task by id task
app.get("/get-task/:id", (req, res, next) => {
    Task.findOne({ _id: req.params.id })?.populate('project_id')?.populate('attribuate_to')
        .then((taskFromDb) => { res.status(200).send(taskFromDb) })
        .catch((error) => { console.error(error); res.status(400).json({ error: 'Impossible de récuperé la tâche' }); });
});


// get task by id task
app.get("/get-tasks-by-id-user/:id", (req, res, next) => {
    Task.find({ attribuate_to: { $in: req.params.id } })?.populate('project_id')?.populate('attribuate_to')
        .then((taskFromDb) => { res.status(200).send(taskFromDb) })
        .catch((error) => { console.error(error); res.status(400).json({ error: 'Impossible de récuperé la tâche' }); });
});
// get task by id ticket
app.get("/get-tasks-by-id-ticket/:id", (req, res, next) => {
    Task.find({ ticketId: { $in: req.params.id } })?.populate('project_id')?.populate('attribuate_to')
        .then((taskFromDb) => { res.status(200).send(taskFromDb) })
        .catch((error) => { console.error(error); res.status(400).json({ error: 'Impossible de récuperé la tâche' }); });
});


// get task in progress by id task
app.get("/get-tasks-in-progress-by-id-user/:id", (req, res, next) => {
    Task.find({ attribuate_to: { $in: req.params.id }, percent: { $ne: 100 } })?.populate('project_id')?.populate('attribuate_to')?.populate('creator_id')
        .then((taskFromDb) => { res.status(200).send(taskFromDb) })
        .catch((error) => { console.error(error); res.status(400).json({ error: 'Impossible de récuperé la tâche' }); });
});

// get task finished by id task
app.get("/get-tasks-finished-by-id-user/:id", (req, res, next) => {
    Task.find({ attribuate_to: { $in: req.params.id }, percent: 100 })?.populate('project_id')?.populate('attribuate_to')?.populate('creator_id')
        .then((taskFromDb) => { res.status(200).send(taskFromDb) })
        .catch((error) => { console.error(error); res.status(400).json({ error: 'Impossible de récuperé la tâche' }); });
});


// get tasks by id project
app.get("/get-tasks/:id", (req, res, next) => {
    Task.find({ project_id: req.params.id })?.populate('project_id')?.populate('attribuate_to')?.populate('creator_id')
        .then((tasksFromDb) => { res.status(200).send(tasksFromDb) })
        .catch((error) => { console.error(error); res.status(500).json({ error: 'Impossible de récuperé la liste des tâches' }); });
});


// suppression d'une tâche
app.delete("/delete-task/:id", (req, res, next) => {
    Task.deleteOne({ _id: req.params.id })
        .then((response) => { res.status(200).json({ success: 'Tâche supprimé' }) })
        .catch((error) => { console.error(error); res.status(400).json({ error: 'Impossible de supprimer cette tâche' }); })
});


module.exports = app;