const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const { Vente } = require("./../models/vente");
const multer = require('multer');
const fs = require("fs")
var mime = require('mime-types')
const path = require('path');
const { FormulaireICBS } = require("../models/formulaireICBS");

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new FormulaireICBS({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { res.status(400).send(error); });
})

app.get("/getAll", (req, res, next) => {
    FormulaireICBS.find()
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.delete('/delete/:id', (req, res) => {
    FormulaireICBS.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    })
})


module.exports = app;