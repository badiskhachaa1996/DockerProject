const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const { FormationsIntuns } = require("./../models/formationsIntuns");
const multer = require('multer');
const fs = require("fs")
var mime = require('mime-types')
const path = require('path');
const { EtudiantIntuns } = require("../models/etudiantsIntuns");

app.post("/FI/create", (req, res) => {
    delete req.body._id
    let f = new FormationsIntuns({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { res.status(400).send(error); });
})

app.post("/EI/create", (req, res) => {
    delete req.body._id
    let f = new EtudiantIntuns({ ...req.body })
    f.save()
        .then((FFSaved) => {
            EtudiantIntuns.findById(FFSaved._id).populate('user_id').populate('formation_id')
                .then((formFromDb) => { res.status(200).send(formFromDb); })
                .catch((error) => { res.status(500).send(error.message); });
        })
        .catch((error) => { res.status(400).send(error); });
})

app.get("/EI/getByID/:id", (req, res) => {
    EtudiantIntuns.findById(req.params.id).populate('user_id').populate('formation_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
})

app.get("/EI/getByUSERID/:id", (req, res) => {
    EtudiantIntuns.findOne({ user_id: req.params.id }).populate('user_id').populate('formation_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
})

app.get("/EI/getAll", (req, res, next) => {
    EtudiantIntuns.find().populate('user_id').populate('formation_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/FI/getAll", (req, res, next) => {
    FormationsIntuns.find()
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.put("/FI/update", (req, res) => {
    FormationsIntuns.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.send(doc)
    })
})
app.put("/EI/update", (req, res) => {
    EtudiantIntuns.findByIdAndUpdate(req.body._id, { ...req.body }, (err, doc) => {
        EtudiantIntuns.findById(req.body._id).populate('user_id').populate('formation_id')
            .then((formFromDb) => { res.status(200).send(formFromDb); })
            .catch((error) => { res.status(500).send(error.message); });
    })
})

module.exports = app;