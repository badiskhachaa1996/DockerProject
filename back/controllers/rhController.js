const express = require('express');
const app = express();
app.disable("x-powered-by");
const { User } = require("./../models/user");
const { Collaborateur } = require('../models/Collaborateur');

// création d'un nouveau collaborateur
app.post('/rh/post-collaborateur', (req, res) => {
    const collaborateur = new Collaborateur({ ...req.body });

    collaborateur.save()
    .then((response) => { res.status(201).send(response) })
    .catch((error) => { console.log(error); res.status(500).send(error); });
});

// mettre à jour les informations personnelles du collaborateur
app.patch('/rh/update-agent-personnal-data', (req, res) => {
    User.findOneAndUpdate({_id: req.body._id}, { ...req.body })
    .then((response) => { res.status(201).send(response) })
    .catch((error) => { res.status(400).send(error) });
});

// mettre à jour les informations du collaborateur
app.patch('/rh/update-agent-data', (req, res) => {
    Collaborateur.findOneAndUpdate({_id: req.body._id}, { ...req.body })
    .then((response) => { res.status(201).send(response) })
    .catch((error) => { res.status(400).send(error) });
});

// récupérer la liste des collaborateurs
app.get('/get-collaborateurs', (req, res) => {
    Collaborateur.find().populate('user_id')
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).send(error); });
});

// récupérer la liste d'un collaborateur via son id
app.get('/get-collaborateur/:id', (req, res) => {
    const { id } = req.params;
    Collaborateur.findOne({_id: id}).populate('user_id')
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).send(error); });
});

// récupérer la liste d'un collaborateur via son user_id
app.get('/get-collaborateur-bu-user-id/:id', (req, res) => {
    const { id } = req.params;
    Collaborateur.findOne({user_id: id}).populate('user_id')
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).send(error); });
});

// ajout d'un document au collaborateur


module.exports = app;