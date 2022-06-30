const express = require('express');
const app = express();
const { Historique } = require("./../models/historique");
app.disable("x-powered-by");

//Recuperation des historiques
app.get('/getAll', (req, res, next) => {
    Historique.find()
        .then((historiquesFromDb) => { res.status(200).send(historiquesFromDb) })
        .catch((error) => { res.status(400).send(error.message) });
})

//creation d'une nouvelle historique
app.post('/create', (req, res, next) => {
    let historique = new Historique({
        user_id: req.body.user_id,
        date_debut: req.body.date_debut,
        date_fin:req.body.date_fin,
        role:req.body.role
    });

    historique.save()
        .then((historiqueSaved) => { res.status(201).send(historiqueSaved) })
        .catch((error) => { res.status(400).send(error.message) });

});

//Recuperation d'une matière via son identifiant
app.get('/getById/:id', (req, res, next) => {
    Historique.findOne({ _id: req.params.id })
        .then((historiquesFromDb) => { res.status(200).send(historiquesFromDb) })
        .catch((error) => { res.status(500).send(error.message) });
});

//Mise à jour d'une matiere via son identifiant
app.post('/endHistorique', (req, res, next) => {
    Historique.findOneAndUpdate({ user_id: req.body.user_id,date_fin:null },
        {
            date_fin: req.body?.date_fin
        })
        .then((historiquesFromDb) => { res.status(200).send(historiquesFromDb) })
        .catch((error) => { res.status(500).send(error) })
});

app.get("/getAll", (req, res, next) => {
    Historique.find()
        .then((historiqueList) => {
            res.status(400).send(historiqueList)
        })
        .catch((error) => { res.status(400).send(error.message) });
});

module.exports = app;