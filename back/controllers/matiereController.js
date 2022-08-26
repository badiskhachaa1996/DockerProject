const express = require('express');
const { Diplome } = require('../models/diplome');
const { Seance } = require('../models/seance');
const app = express();
app.disable("x-powered-by");
const { Matiere } = require('./../models/matiere');

//Recuperation des matières
app.get("/getAll", (req, res, next) => {
    Matiere.find()
        .then((matieresFromDb) => { res.status(200).send(matieresFromDb) })
        .catch((error) => { res.status(400).send(error.message) });
})


//creation d'une nouvelle matiere
app.post("/create", (req, res, next) => {
    let matiere = new Matiere({
        nom: req.body.nom,
        formation_id: req.body.formation_id,
        volume_init: req.body.volume_init,
        abbrv: req.body.abbrv,
        classe_id: req.body.classe_id,
        seance_max: req.body.seance_max,
        coeff: req.body.coeff,
        credit_ects: req.body.credit_ects,
        remarque: req.body.remarque,
        semestre: req.body.semestre,
        niveau: req.body.niveau
    });

    matiere.save()
        .then((matiereSaved) => { res.status(201).send(matiereSaved) })
        .catch((error) => { res.status(400).send(error.message) });

});


//Recuperation d'une matière via son identifiant
app.get("/getById/:id", (req, res, next) => {
    Matiere.findOne({ _id: req.params.id })
        .then((matiereFromDb) => { res.status(200).send(matiereFromDb) })
        .catch((error) => { res.status(500).send(error.message) });
});


//Mise à jour d'une matiere via son identifiant
app.post("/updateById", (req, res, next) => {
    Matiere.findOneAndUpdate({ _id: req.body._id },
        {
            nom: req.body?.nom,
            formation_id: req.body.formation_id,
            volume_init: req.body.volume_init,
            abbrv: req.body.abbrv,
            seance_max: req.body.seance_max,
            coeff: req.body.coeff,
            credit_ects: req.body.credit_ects,
            remarque: req.body.remarque,
            semestre: req.body.semestre,
            niveau: req.body.niveau
        })
        .then((matiereUpdated) => { res.status(200).send(matiereUpdated) })
        .catch((error) => { res.status(500).send(error) })
});

app.get("/getMatiereList", (req, res, next) => {
    Matiere.find()
        .then((matiereList) => {
            Diplome.find().then((diplomeList) => {
                var r = []
                diplomeList.forEach(diplome => {
                    let items = []
                    matiereList.forEach(matiere => {
                        if (matiere.formation_id.toString() == diplome._id.toString()) {

                            items.push({ label: matiere.nom, value: matiere._id })
                        }
                    })
                    if (items.length != 0) {
                        r.push({ label: diplome.titre, items: items })
                    }
                })
                res.status(200).send(r)
            })
        })
        .catch((error) => { res.status(400).send(error.message) });

});

app.get("/getDicMatiere", (req, res, next) => {
    Matiere.find()
        .then((matiereList) => {
            Diplome.find().then((diplomeList) => {
                var r = {}
                diplomeList.forEach(diplome => {
                    r[diplome._id.toString()] = []
                    matiereList.forEach(matiere => {
                        if (matiere.formation_id.toString() == diplome._id.toString()) {
                            r[diplome._id.toString()].push(matiere)
                        }
                    })
                })
                res.status(200).send(r)
            })
        })
        .catch((error) => { res.status(400).send(error.message) });

});

app.get("/getAllVolume", (req, res, next) => {
    Seance.find()
        .then((SeanceList) => {
            var rPlan = {}
            var rCons = {}
            var date = new Date()
            SeanceList.forEach(seance => {
                //Calcule du nb d'heure
                let sd1 = new Date(seance.date_debut).getTime()
                let sd2 = new Date(seance.date_fin).getTime()
                let diff = sd2 - sd1
                let nb = Math.floor((diff % 86400000) / 3600000);
                console.log(nb)
                if (date < seance.date_debut) {
                    if (rPlan[seance.matiere_id]) {
                        rPlan[seance.matiere_id] += nb
                    } else {
                        rPlan[seance.matiere_id] = nb
                    }
                } else {
                    if (rCons[seance.matiere_id]) {
                        rCons[seance.matiere_id] += nb
                    } else {
                        rCons[seance.matiere_id] = nb
                    }
                }
            })
            console.log({ rPlan, rCons })
            res.status(200).send({ rPlan, rCons })
        })
        .catch((error) => {
            console.error(error)
            res.status(400).send(error.message)
        });
});

module.exports = app;