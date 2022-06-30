const express = require("express");
const app = express();
app.disable("x-powered-by");
const { forfeitForm } = require('./../models/forfeitForm');

//Récupère la liste des examens
app.get("/getAll", (req, res, next) => {
    forfeitForm.find()
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getById/:id", (req, res, next) => {
    forfeitForm.findOne({ _id: req.params.id })
        .then((examenFromDb) => { res.status(200).send(examenFromDb); })
        .catch((error) => { res.status(400).send(error.message); });
});

app.post("/updateById", (req, res) => {
    forfeitForm.updateOne({ _id: req.body._id }, { ...req.body })
        .then(data => {
            res.status(200).send(data)
        })
        .catch((error) => { res.status(400).send(error.message); });
})

app.get("/delete/:id", (req, res) => {
    forfeitForm.findByIdAndRemove(req.params.id)
        .then(data => {
            res.status(200).send(data)
        })
        .catch((error) => { res.status(400).send(error.message); });
})

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new forfeitForm({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { res.status(400).send(error); });
})




module.exports = app;