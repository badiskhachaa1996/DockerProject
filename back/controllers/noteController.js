const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Note } = require('../models/note');


//Recuperation de la liste des notes
app.get("/getAll", (req, res, next) => {
    Note.find()
        .then((notesFromDb) => { res.status(200).send(notesFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});


//Recuperation de la liste des notes via un id et un semestre
app.get("/getAllByIdBySemestre/:id/:semestre", (req, res, next) => {
    Note.find({ etudiant_id: req.params.id, semestre: req.params.semestre })
        .then((notesFromDb) => { res.status(200).send(notesFromDb); })
        .catch((error) => { res.status(400).send(error); });
});


//Recuperation de la liste des notes par semestre et par classe
app.get("/getAllByClasseBySemestreByExam/:semestre/:classe/:exam", (req, res, next) => {
    Note.find({ semestre: req.params.semestre, classe_id: req.params.classe, examen_id: req.params.exam })
        .then((notesFromDb) => { res.status(200).send(notesFromDb); })
        .catch((error) => { res.status(400).send(error); });
});


//Recupère une note via son identifiant
app.get("/getById/:id", (req, res, next) => {
    Note.findOne({ _id: req.params.id })
        .then((noteFromDb) => { res.status(200).send(noteFromDb); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Récupère la liste des notes via un id classe
app.get("/getAllByClasse/:id", (req, res, next) => {
    Note.find({ classe_id: req.params.id })
        .then((notesFromDb) => { res.status(200).send(notesFromDb); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Permet de verifier si un etudiant à deja une note pour le meme semestre et pour la meme matiere
app.get("/verifNoteByIdBySemestreByExam/:id/:semestre/:exam", (req, res, next) => {
    Note.findOne({ etudiant_id: req.params.id, semestre: req.params.semestre, examen_id: req.params.exam })
        .then((noteFromDb) => { 
            if(noteFromDb)
            {
                res.status(201).json({ error: "L'étudiant possède déjà une note" });
            }
            else
            {
                res.status(200).json({ success: "L'étudiant ne possède pas de note" });
            }
             
        })
        .catch((error) => { res.status(500).send("Veuillez contacter un administrateur"); });
});


//Création d'une nouvelle note
app.post("/create", (req, res, next) => {

    //Création du nouvel objet Note
    let data = req.body;

    let note = new Note(
        {
            note_val: data.note_val,
            semestre: data.semestre,
            etudiant_id: data.etudiant_id,
            examen_id: data.examen_id,
            appreciation: data.appreciation,
            classe_id: data.classe_id,
            matiere_id: data.matiere_id,
        }
    );

    note.save()
        .then((noteSaved) => { res.status(200).send(noteSaved); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Recuperation d'une liste de note par semestre et par classe
app.get("/getAllByClasseBySemestre/:classeid/:semestre", (req, res, next) => {
    Note.find({ classe_id: req.params.classeid, semestre: req.params.semestre })
        .then((noteFromDb) => { res.status(200).send(noteFromDb); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Mise à jour d'une note via son identifiant
app.put("/updateById/:id", (req, res, next) => {

    Note.findOneAndUpdate({ _id: req.params.id }, 
        {
            note_val: req.body.note_val,
            semestre:  req.body.semestre,
            etudiant_id: req.body.etudiant_id,
            examen_id: req.body.examen_id,
            appreciation: req.body.appreciation,
            classe_id: req.body.classe_id,
            matiere_id: req.body.matiere_id,
        })
        .then((noteUpdated) => { res.status(200).send(noteUpdated); })
        .catch((error) => {res.status(400).send(error.message); });

});

//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;