const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Examen } = require('./../models/examen');


//Récupère la liste des examens
app.get("/getAll", (req, res, next) => {
    Examen.find()
        .then((examensFromDb) => { res.status(200).send(examensFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

//Récupère la liste des examens
app.get("/getAllPopulate", (req, res, next) => {
    Examen.find().populate('classe_id').populate('matiere_id').populate({ path: 'formateur_id', populate: { path: "user_id" } })
        .then((examensFromDb) => { res.status(200).send(examensFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

//Récupère la liste des evaluations
app.get("/getAllEvaluation", (req, res, next) => {
    Examen.find()//WIP
        .then((examensFromDb) => { res.status(200).send(examensFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});


//Recupère un examen via son identifiant
app.get("/getById/:id", (req, res, next) => {
    Examen.findOne({ _id: req.params.id })
        .then((examenFromDb) => { res.status(200).send(examenFromDb); })
        .catch((error) => { res.status(400).send(error.message); });
});

app.get('/getAllByFormateurID/:id', (req, res, next) => {
    console.log(req.params.id)
    Examen.find({ formateur_id: req.params.id }).populate('classe_id').populate('matiere_id').populate({ path: 'formateur_id', populate: { path: "user_id" } })
        .then((examenFromDb) => { res.status(200).send(examenFromDb); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Recuperer des examens via un id de classe
app.get("/getAllByClasseId/:id", (req, res, next) => {
    Examen.find({ classe_id: req.params.id })
        .then((examensFromDb) => { res.status(200).send(examensFromDb); })
        .catch((error) => { res.status(400).send(error.message); })
});


//Création d'un nouvell examen
app.post("/create", (req, res, next) => {

    //creation du nouvel objet examen
    let data = req.body;
    console.log(data)

    let examen = new Examen(
        {
            ...data
        });

    examen.save()
        .then((examenSaved) => { res.status(200).send(examenSaved); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Mise à jour d'un examen via son identifiant
app.put("/updateById/:id", (req, res, next) => {

    Examen.findOneAndUpdate({ _id: req.params.id },
        {
            classe_id: req.body.classe_id,
            matiere_id: req.body.matiere_id,
            formateur_id: req.body.formateur_id,
            date: req.body.date,
            type: req.body.type,
            note_max: req.body.note_max,
            coef: req.body.coef,
            libelle: req.body.libelle,
        })
        .then((examenUpdated) => { res.status(200).send(examenUpdated); })
        .catch((error) => { res.status(400).send(error.message); });

});

//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;