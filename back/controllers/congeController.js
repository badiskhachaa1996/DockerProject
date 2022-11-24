const express = require('express');
const app = express();
app.disable("x-powered-by");
const { Conge } = require('./../models/Conge');


//Methode de demande de congés
app.post("/new-holidays", (req, res) => {
    const conge = new Conge({ ...req.body });

    conge.save()
    .then((response) => { res.status(201).send(response); })
    .catch((error) => { res.status(500).send(error.message); })
});


//Methode de validation de congés
app.patch("/validate-holidays", (req, res) => {
    const conge_id = req.body.conge_id;

    Conge.updateOne({ _id: conge_id }, { statut: 'Approuvé' })
    .then((response) => { res.status(201).send(response); })
    .catch((error) => { res.status(404).send(error.message); })
});


//Methode de refus d'une demande de congés
app.patch("/refuse-holidays", (req, res) => {
    const conge_id = req.body.conge_id;

    Conge.updateOne({ _id: conge_id }, { statut: 'Refusé' })
    .then((response) => { res.status(201).send(response); })
    .catch((error) => { res.status(404).send(error.message); })
});


//Methode de recuperation des demandes d'un utilisateur entre 2 dates
app.get("get-by-user-id-between-populate/:user_id/:beginDate/:endDate", (req, res) => {
    let id = req.params.user_id;
    let beginDate = req.params.beginDate;
    let endDate = req.params.endDate;

    Conge.find({ _id: id, beginDate: { $gte: beginDate, $lte: endDate } })
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).send(error.message); });
});


//Methode de recuperation des demandes entre 2 dates
app.get("get-all-between-populate/:beginDate/:endDate", (req, res) => {
    let beginDate = req.params.beginDate;
    let endDate = req.params.endDate;

    Conge.find({ beginDate: { $gte: beginDate, $lte: endDate } })
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).send(error.message); });
});


module.exports = app;