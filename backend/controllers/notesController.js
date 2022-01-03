const express = require("express");
const app = express();
const { Notes } = require("./../models/notes");

//Creation d'une nouvelle seance
app.post('/create', (req, res, next) => {
    
    //Création d'une nouvelle seance
    const notes = new Notes({
        score: req.body.score,
        user_id: req.body.date_debut,
        examen_id: req.body.date_fin,
        answerList:req.body.answerList
    });

    //Envoi vers la BD
    notes.save()
        .then((notefromdb) => res.status(201).send(notefromdb))
        .catch(error => res.status(400).send(error));
});

//Récuperer une notes
app.post("/getById/:id", (req, res) => {
    Notes.findOne({ _id: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send(error);
    })
});

//Récuperer toutes les notes
app.get("/getAll", (req, res) => {
    Notes.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })
});

//Récupérer tous les notes d'un user
app.get("/getAllByUser/:id", (req, res) => {
    Notes.find({ user_id: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send(error);
    })
});

//Récupérer tous les notes d'un examen
app.get("/getAllByExamen/:id", (req, res) => {
    Notes.find({ examen_id: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send(error);
    })
});

module.exports = app;