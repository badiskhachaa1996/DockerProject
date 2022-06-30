const express = require('express');
const app = express();
app.disable("x-powered-by");
const { Appreciation } = require('../models/appreciation');

//Recuperation de la liste des appreciations
app.get("/getAll", (req, res, next) => {
    Appreciation.find()
                .then((appreciationsFromDb) => { res.status(200).send(appreciationsFromDb); })
                .catch((err) => { res.status(500).send(err); })
});


//Recuperation d'une appreciation par semestre et par etudiant
app.get("/get/:etudiant_id/:semestre", (req, res, next) => {
    Appreciation.findOne({ 
        etudiant_id: req.params.etudiant_id, 
        semestre: req.params.semestre
    })
    .then((appreciationFromDb) => { res.status(200).send(appreciationFromDb); })
    .catch((err) => { res.status(400).send(err); })
});


//creation d'une nouvelle appreciation pour un semestre et pour un utilisateur
app.post("/create", (req, res, next) => {
    delete req.body._id;
    const appreciation = new Appreciation({ 
        ...req.body 
    });

    appreciation.save()
                .then((appreciationSaved) => { res.status(201).send(appreciationSaved); })
                .catch((err) => { res.status(400).send(err); })
});


//Modification d'une appreciation existante
app.put("/updateById/:id", (req, res, next) => {
        
    Appreciation.findOneAndUpdate({ _id: req.params.id }, 
    {
        appreciation: req.body.appreciation,
        semestre: req.body.semestre,
        etudiant_id: req.body.etudiant_id,
    })
    .then((appreciationUpdated) => { res.status(200).send(appreciationUpdated); })
    .catch((err) => { res.status(500).send(err); })
});

module.exports = app;