const express = require("express");
const mongoose = require("mongoose")
const Sujet = mongoose.model('sujet')
const { Demande_events } = require("./../models/demande_event");
const app = express();
app.disable("x-powered-by");
const jwt = require("jsonwebtoken");
const multer = require('multer');

let origin = ["http://localhost:4200"]

if (process.argv[2]) {
    let argProd = process.argv[2]
    if (argProd.includes('dev')) {
        origin = ["https://t.dev.estya.com"]
    } else (
        origin = ["https://ticket.estya.com", "https://estya.com", "https://adgeducations.com"]
    )
}

app.post("/create", (req, res, next) => {

    //création d'un nvx event
    let data = req.body.newEvent;
    let NewEvent = new Demande_events(
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
    Demande_events.find()
        .then((result) => { res.status(200).send(result); })
        .catch((error) => { req.status(500).json({ error: "Probleme porte ouverte " + error.message }); });
})

module.exports = app;