const express = require('express');
const app = express();
const { Matiere } = require('./../models/matiere');

//Recuperation des matières
app.get('/getAll', (req, res, next) => {
    Matiere.find()
    .then((matieresFromDb) => { res.status(200).send(matieresFromDb) })
    .catch((error) => { res.status(400).send(error.message)});
})


//creation d'une nouvelle matiere
app.post('/create', (req, res, next) => {

    let matiere = new Matiere({
        nom: req.body.nom,
    });


    matiere.save()
    .then((matiereSaved) => { res.status(201).send(matiereSaved) })
    .catch((error) => { res.status(400).send(error.message)});

});


//Recuperation d'une matière via son identifiant
app.get('/getById/:id', (req, res, next) => {
    Matiere.findOne({ _id: req.params.id })
    .then((matiereFromDb) => { res.status(200).send(matiereFromDb)})
    .catch((error) => { res.status(500).send(error.message) });
});


//Mise à jour d'une matiere via son identifiant
app.post('/updateById', (req, res, next) => {
    Matiere.findOneAndUpdate({ _id: req.body._id }, 
        { 
            nom: req.body?.nom,
        })
    .then((matiereUpdated) => { res.status(200).send(matiereUpdated) })
    .catch((error) => { res.status(500).send(error)})
});

module.exports = app;