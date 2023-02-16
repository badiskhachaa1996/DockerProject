const express = require('express');
const app = express();
app.disable("x-powered-by");
const { ProgressionPeda } = require('./../models/progressionPeda');

//création d'un nouveau prestataire
app.post("/create", (req, res, next) => {
    delete req.body._id
    let pp = new ProgressionPeda(
        {
            ...req.body
        });

    pp.save()
        .then((ppSaved) => { res.status(201).send(ppSaved); })
        .catch((error) => { res.status(500).send(error); });

});

app.get('/getAllByUserID/:user_id', (req, res, next) => {
    ProgressionPeda.find({ user_id: req.params.user_id }).populate('seance_id').populate({ path: "seance_id", populate: { path: 'classe_id', populate: { path: 'diplome_id', populate: { path: 'campus_id', populate: { path: "ecole_id" } } } } }).populate({ path: "seance_id", populate: { path: 'matiere_id' } }).then(pps => {
        res.status(201).send(pps)
    }).catch((error) => { res.status(500).send(error); });
});


app.get('/getAllByUserIDAndSemestre/:user_id/:semestre', (req, res, next) => {
    ProgressionPeda.find({ user_id: req.params.user_id, semestre: req.params.semestre }).then(pps => {
        res.status(201).send(pps)
    }).catch((error) => { res.status(500).send(error); });
});

//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;