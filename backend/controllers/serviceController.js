const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { Service } = require("./../models/Service");


app.post("/addService", (req, res) => {
    let data = req.body;
    let service = new Service({
        label: data.label
    })
    service.save().then((servFromDb) => {
        res.status(200).send({ message: "Service : "+servFromDb.label + "registration done" });
    }).catch((error) => {
        res.status(400).send(error);
    })
});
module.exports = app;
