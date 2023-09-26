const express = require("express");
const { DisponbiliteEtudiant } = require("../models/disponibiliteEtudiant");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new DisponbiliteEtudiant({ ...req.body })
    f.save()
        .then((TFsaved) => { res.status(201).send(TFsaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/getByID/:id", (req, res, next) => {
    DisponbiliteEtudiant.findById(req.params.id).populate('user_id')
        .then((data) => { res.status(200).send(data); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/getAll", (req, res, next) => {
    DisponbiliteEtudiant.find().populate('user_id').sort({ from: -1 })
        .then((arrayData) => { res.status(200).send(arrayData); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/getAllByUSERID/:user_id", (req, res, next) => {
    DisponbiliteEtudiant.find({ user_id: req.params.user_id }).populate('user_id').sort({ from: -1 })
        .then((arrayData) => { res.status(200).send(arrayData); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/update", (req, res) => {
    DisponbiliteEtudiant.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.status(200).send(doc);
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    DisponbiliteEtudiant.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

module.exports = app;