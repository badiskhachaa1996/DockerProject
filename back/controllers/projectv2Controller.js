const express = require("express");
const app = express();
const { Project } = require("./../models/project/ProjectV2");
const { Task } = require("./../models/project/Task");
const { Ressources } = require("./../models/project/Ressources");
const { Budget } = require("./../models/project/Budget");
const { Ticket } = require("../models/ticket");



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

// get project by id project
app.get('/get-project/:id', (req, res, next) => {
    Project.findOne({ _id: req.params.id })?.populate('creator_id')
    .then((project) => { res.status(200).send(project); })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de récuperer le projet'}); })
});

app.put("/put-project", (req, res, next) => {
    const project = new Project({ ...req.body });

    Project.updateOne({ _id: project._id }, { ...req.body })
    .then((project) => { res.status(201).json({ project: project, success: 'Projet mis à jour'}); })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de mettre à jour le projet, si le problème persite veuillez créer un ticket au service IMS' }); });
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
    Task.find({ project_id: req.params.id })?.populate('project_id')?.populate('attribuate_to')?.populate('creator_id')?.populate('ticketId')
    .then((tasksFromDb) => { res.status(200).send(tasksFromDb) })
    .catch((error) => { console.log(error); res.status(500).json({ error: 'Impossible de récuperé la liste des tâches' }); });
});

// get task by id task
app.get("/get-task/:id", (req, res, next) => {
    Task.findOne({ _id: req.params.id })?.populate('project_id')?.populate('attribuate_to')?.populate('creator_id')?.populate('ticketId')
    .then((taskFromDb) => { res.status(200).send(taskFromDb) })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de récuperé la tâche' }); });
});
// get task by id ticket
app.get("/get-tasks-by-id-ticket/:id", (req, res, next) => {
    Task.findOne({ ticketId: req.params.id })?.populate('project_id')?.populate('attribuate_to')
    .then((taskFromDb) => { res.status(200).send(taskFromDb) })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de récuperé la tâche' }); });
});
// get task by id agent
app.get("/get-tasks-by-id-agent/:id", (req, res, next) => {
    Task.find({ attribuate_to: { $in: req.params.id } })?.populate('project_id')?.populate('ticketId')
    .then((taskFromDb) => { res.status(200).send(taskFromDb) })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de récuperé la tâche' }); });
});
// update task 
app.put("/put-task", (req, res, next) => {
    const task = new Task({ ...req.body });

    Task.updateOne({ _id: task._id }, { ...req.body })
    .then((taskUpdated) => { res.status(201).json({ task: taskUpdated, success: 'Tâche mis à jour' }); })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de mettre à jour cette tâche' }); });
});

// suppression d'une tâche
app.delete("/delete-task/:id", (req, res, next) => {
    Task.deleteOne({ _id: req.params.id })
    .then((response) => { res.status(200).json({ success: 'Tâche supprimé' }) })
    .catch((error) => {console.log(error); res.status(400).json({ error: 'Impossible de supprimer cette tâche' });})
});



//PARTIE ressources


// create new ressource
app.post("/post-ressources", (req, res, next) => {
    const ressources = new Ressources({ ...req.body });

    ressources.save()
    .then((ressourcesCreated) => { res.status(201).json({ ressources: ressourcesCreated, success: 'ressource créée' }); })
    .catch((error) => { console.log(error); res.status(500).send({ error: 'Impossible de créer une nouvelle ressource' }); });
});

// get ressource by id project
app.get("/get-ressourcess/:id", (req, res, next) => {
    console.log(req.params.id);
    Ressources.find({ project_id: req.params.id })?.populate('project_id')?.populate('attribuate_to')?.populate('creator_id')
    .then((ressourcesFromDb) => { res.status(200).send(ressourcesFromDb) })
    .catch((error) => { console.log(error); res.status(500).json({ error: 'Impossible de récuperé la liste des ressources' }); });
});
// get ressource by id ressources
app.get("/get-ressources/:id", (req, res, next) => {
    Ressources.findOne({ _id: req.params.id })?.populate('project_id')?.populate('attribuate_to')
    .then((ressourcesFromDb) => { res.status(200).send(ressourcesFromDb) })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de récuperé la ressource' }); });
});

// update ressources
app.put("/put-ressources", (req, res, next) => {
    const ressources = new Ressources({ ...req.body });

    Ressources.updateOne({ _id: ressources._id }, { ...req.body })
    .then((ressourcesUpdated) => { res.status(201).json({ ressources: ressourcesUpdated, success: 'Ressources mis à jour' }); })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de mettre à jour cette ressources' }); });
});

// suppression d'une ressource
app.delete("/delete-ressources/:id", (req, res, next) => {
    Ressources.deleteOne({ _id: req.params.id })
    .then((response) => { res.status(200).json({ success: 'Ressource supprimé' }) })
    .catch((error) => {console.log(error); res.status(400).json({ error: 'Impossible de supprimer cette ressource' });})
});


//PARTIE Budget


// create new Budget
app.post("/post-budget", (req, res, next) => {
    const budget = new Budget({ ...req.body });

    budget.save()
    .then((budgetCreated) => { res.status(201).json({ budget: budgetCreated, success: 'Budget créée' }); })
    .catch((error) => { console.log(error); res.status(500).send({ error: 'Impossible de créer un neveaux budget' }); });
});

// get Budget by id project
app.get("/get-budgets/:id", (req, res, next) => {
    console.log(req.params.id);
    Budget.find({ project_id: req.params.id })?.populate('project_id')?.populate('attribuate_to')?.populate('creator_id')
    .then((budgetFromDb) => { res.status(200).send(budgetFromDb) })
    .catch((error) => { console.log(error); res.status(500).json({ error: 'Impossible de récuperé la liste des Budget' }); });
});

// get budget by id budjet
app.get("/get-budget/:id", (req, res, next) => {
    Budget.findOne({ _id: req.params.id })?.populate('project_id')?.populate('attribuate_to')
    .then((budgetFromDb) => { res.status(200).send(budgetFromDb) })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de récuperé le budget' }); });
});

// update budget        
app.put("/put-budget", (req, res, next) => {
    const budget = new Budget({ ...req.body });

    Budget.updateOne({ _id: budget._id }, { ...req.body })
    .then((budgetUpdated) => { res.status(201).json({ budget: budgetUpdated, success: 'budget mis à jour' }); })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de mettre à jour ce  budget' }); });
});

// suppression d'une ressource
app.delete("/delete-budget/:id", (req, res, next) => {
    Budget.deleteOne({ _id: req.params.id })
    .then((response) => { res.status(200).json({ success: 'Budget supprimé' }) })
    .catch((error) => {console.log(error); res.status(400).json({ error: 'Impossible de supprimer ce Budget' });})
});



module.exports = app;