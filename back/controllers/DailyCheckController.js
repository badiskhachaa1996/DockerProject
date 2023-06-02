const express = require('express');
const app = express();
app.disable("x-powered-by");
const { DailyCheck } = require('./../models/DailyCheck');

// recuperation de la liste des présences de tous les utilisateurs
app.get("/get-checks", (req, res) => {
    DailyCheck.find().populate('user_id')
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(500).json({error: error, errorMsg: 'Impossible de récupérer la liste des présences, veuillez contacter un admin'}) });
});


// recuperation de la liste des présences d'un utilisateur
app.get("get-user-checks/:userId", (req, res) => {
    const { userId } = req.params;

    DailyCheck.find({ user_id: userId }).populate('user_id')
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).json({error: error, errorMsg: 'Impossible de récupérer la liste des présences de l\'utilisateurs'}) });
});


// recuperation d'une presence via son id
app.get("/get-check/:id", (req, res) => {
    const { id } = req.params;

    DailyCheck.find({ _id: id }).populate('user_id')
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).json({error: error, errorMsg: 'Impossible de récupérer la liste des présences de l\'utilisateurs'}) });
});


// méthode de check in


module.exports = app;