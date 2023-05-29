const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const multer = require('multer');
const fs = require("fs")
var mime = require('mime-types')
const path = require('path');
const { LeadCRM } = require("../models/leadCRM");

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new LeadCRM({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { res.status(400).send(error); });
})

app.get("/getAll", (req, res, next) => {
    LeadCRM.find()
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});


app.put("/update", (req, res) => {
    LeadCRM.findByIdAndUpdate(req.body._id, { ...req.body }, (err, doc) => {
        if (err) {
            console.error(err); res.status(500).send(err);
        }
        else
            LeadCRM.findById(req.body._id)
                .then((formFromDb) => { res.status(200).send(formFromDb); })
                .catch((error) => { console.error(error); res.status(500).send(error); });
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    LeadCRM.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    })
})

module.exports = app;