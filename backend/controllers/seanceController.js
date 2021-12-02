//importation de express
const express = require('express');
const app = express();
const { Seance } = require("./../models/seance");


//Creation d'une nouvelle seance
app.post('/create', (req, res, next) => {
    
    //Création d'une nouvelle seance
    const seance = new Seance({
        classe_id: req.body.classe_id,
        date_debut: req.body.date_debut,
        date_fin: req.body.date_fin,
        formateur_id: req.body.formateur_id
    });

    //Envoi vers la BD
    seance.save()
        .then((seancefromdb) => res.status(201).send(seancefromdb))
        .catch(error => res.status(400).send(error));
});


//Modification d'une seance via son id
app.post('/edit/:id', (req, res, next) => {
    //Trouve et met à jour une seance
    Seance.findOneAndUpdate(
        { _id: req.params.id },
        {
            classe_id: req.body.classe_id,
            date_debut: req.body.date_debut,
            date_fin: req.body.date_fin,
            formateur_id: req.body.formateur_id
        }
    ).then((seancefromdb) => res.status(201).send(seancefromdb))
        .catch(error => res.status(400).send(error));
});


//Recuperation de toutes les seances
app.get('/getAll', (req, res, next) => {
    Seance.find()
        .then((seancefromdb) => res.status(200).send(seancefromdb))
        .catch(error => res.status(400).send(error));
});


//Recuperation d'une seance selon son id
app.get('/getById/:id', (req, res, next) => {
    Seance.findOne({ _id: req.params.id })
        .then((seancefromdb) => res.status(200).send(seancefromdb))
        .catch(error => res.status(400).send(error));
});


//Recuperation de toute les seances selon l'id d'une classe
app.get('/getAllByClasseId/:id', (req, res, next) => {
    Seance.find({ classe_id: req.params.id })
        .then((seancefromdb) => res.status(200).send(seancefromdb))
        .catch(error => res.status(400).send(error));
});


//Recuperation de toute les seances selon l'identifiant du formateur
app.get('/getAllbyFormateur/:id', (req, res, next) => {
    Seance.find({ formateur_id: req.params.id })
        .then((seancefromdb) => res.status(200).send(seancefromdb))
        .catch(error => res.status(400).send(error));
});



module.exports = app;