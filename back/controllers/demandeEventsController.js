const express = require("express");
const mongoose = require("mongoose")
const Sujet = mongoose.model('sujet')
const { Demande_events } = require("./../models/demande_event");
const app = express();
app.disable("x-powered-by");
const { sourceForm } = require("../models/sourceForm");

app.post("/create", (req, res, next) => {

    //création d'un nvx event
    let data = req.body;
    let NewEvent = new sourceForm(
        {
            ...data
        });

    NewEvent.save()
        .then((eventSaved) => {
            res.status(201).json({ success: "Inscription prise en compte" })
        })
        .catch((error) => {
            res.status(400).json({ msg: "Erreur réessayez plus tard", error })
        });
})

app.get("/getAll", (req, res, next) => {
    sourceForm.find()
        .then((result) => { res.status(200).send(result); })
        .catch((error) => { req.status(500).json({ error: "Probleme porte ouverte " + error.message }); });
})

module.exports = app;