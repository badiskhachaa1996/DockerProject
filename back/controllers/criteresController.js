const express = require("express");
const app = express(); 
app.disable("x-powered-by");
const multer = require('multer');
const fs = require("fs")
var mime = require('mime-types')
const path = require('path');
const { Critere } = require("../models/critere");
const { User } = require("../models/user");


app.get("/getAll", (req, res, next) => {
    Critere.find()
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/getByUSERID/:id", (req, res) => {
    Critere.findOne({ user_id: req.params.id }).populate('user_id').populate('team_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.post("/create", (req, res) => {
    delete req.body._id
    console.log(req)
    let f = new Critere({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.put("/update", (req, res) => {
    Critere.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})


app.delete("/delete/:id", async (req, res) => {
    try {
        const deletedCritere = await Critere.findByIdAndDelete(req.params.id);
        if (!deletedCritere) {
            return res.status(404).send({ error: 'Critere not found' });
        }
        
        res.status(200).send(deletedCritere);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
module.exports = app;