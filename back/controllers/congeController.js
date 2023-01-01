const express = require('express');
const app = express();
app.disable("x-powered-by");
const { Conge } = require('./../models/Conge');
const { User } = require("./../models/user");

//Methode de demande de congés
app.post("/new-holidays", (req, res) => {
    const conge = new Conge({ ...req.body });

    //Recuperation de l'utilisateur
    User.findOne({ _id: conge.user_id })
    .then((user) => {
        //Recuperation de l'id du responsable de service de l'utilisateur
        User.findOne({ service_id: user.service_id, role: 'Responsable' })
        .then((referent) => {
            conge.referent_id = referent._id;
            console.log(conge)
            //Enregistrement du congé dans la base de données
            conge.save()
            .then((response) => { res.status(201).send(response); })
            .catch((error) => { res.status(500).send("Impossible de prendre en compte votre demande de congés"); })
        })
        .catch((error) => { res.status(400).send("Vous n'êtes lié à aucun service, veuillez contacter un administrateur"); });
    })
    .catch((error) => { res.status(500).send('Erreur interne veuillez contacter un administrateur'); })
});


//Methode de validation de congés
app.patch("/validate-holidays", (req, res) => {
    const conge_id = req.body.conge_id;

    Conge.updateOne({ _id: conge_id }, { statut: 'Validé' })
    .then((response) => { res.status(201).send(response); })
    .catch((error) => { res.status(404).send(error.message); })
});


//Methode de refus d'une demande de congés
app.patch("/refuse-holidays", (req, res) => {
    const conge_id = req.body.conge_id;

    Conge.updateOne({ _id: conge_id }, { statut: 'Refusé' })
    .then((response) => { res.status(201).send(response); })
    .catch((error) => { res.status(400).send(error.message); })
});


//Methode de recuperation des demandes d'un utilisateur entre 2 dates
app.get("/get-by-user-id/:user_id", (req, res) => {
    let id = req.params.user_id;

    Conge.find({ _id: id }).populate("user_id").populate("referent_id")
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).send(error.message); });
});


//Methode de recuperation des demandes entre 2 dates
app.get("/get-all-populate", (_, res) => {

    Conge.find()?.populate('user_id')?.populate('referent_id')
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).send(error.message); });
});


//Methode de recuperation des demandes entre 2 dates pour un service
app.get("/get-all-between-populate-for-service/:user_id", (req, res) => {
    let id = req.params.user_id;

    //Recuperation et envoi de la liste des demande du service de l'utilisateur
    Conge.find({ referent_id: id })?.populate('user_id')
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).send('Aucune demandes ne vous est assigné'); });
});


module.exports = app;