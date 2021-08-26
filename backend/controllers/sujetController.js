const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { Sujet } = require("./../models/sujet");


app.post("/addsujet", (req, res) => {
    let data = req.body;
    let service = new Service({
        label: data.label
    })
    sujet.save().then((sujetFromDb) => {
        res.status(200).send({ message: "Service : "+sujetFromDb.service_id + "registration done sujet :"+sujetFromDb/label });
    }).catch((error) => {
        res.status(400).send(error);
    })
});
module.exports = app;
