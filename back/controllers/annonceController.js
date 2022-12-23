const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Annonce } = require('./../models/Annonce');

//Création d'une annonce
app.post("/post-annonce", (req, res) => {
    const annonce = new Annonce({ ...req.body });

    annonce.save()
        .then((annonceSaved) => { res.status(201).send(annonceSaved); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Recuperation de la liste des annonces
app.get("/get-annonces", (_, res) => {
    Annonce.find()
        .then((annonces) => { res.status(200).send(annonces); })
        .catch((error) => { res.status(500).send(error.message); });
});


//Récuperation d'une annonce via on identifiant
app.get("/get-annonce", (req, res) => {
    Annonce.findById(req.params.annonceId)
        .then((annonce) => { res.status(200).send(annonce); })
        .catch((error) => { res.status(500).send(error.message); });
});


//Modification d'une annonce
app.put("/put-annonce", (req, res) => {

    Annonce.updateOne({ _id: req.body._id }, { ...req.body })
        .then((annonce) => { res.status(200).send(annonce) })
        .catch((error) => { res.status(500).send(error.message) })
});

module.exports = app;