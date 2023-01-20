const express = require('express');
const { Diplome } = require('../models/diplome');
const { Seance } = require('../models/seance');
const app = express();
app.disable("x-powered-by");
const { Matiere } = require('./../models/matiere');
const { Classe } = require('./../models/classe');

//Recuperation des matières
app.get("/getAll", (req, res, next) => {
    Matiere.find()
        .then((matieresFromDb) => { res.status(200).send(matieresFromDb) })
        .catch((error) => { res.status(400).send(error.message) });
})

//Recuperation des matières
app.get("/getAllPopulate", (req, res, next) => {
    Matiere.find().populate('formation_id')
        .then((matieresFromDb) => { res.status(200).send(matieresFromDb) })
        .catch((error) => { res.status(400).send(error.message) });
})

//Recuperation des matières
app.post("/getAllPopulateByFormationID", (req, res, next) => {

    Matiere.find({ formation_id: { $in: req.body.formation_id } }).populate('formation_id')
        .then((matieresFromDb) => { res.status(200).send(matieresFromDb) })
        .catch((error) => { res.status(400).send(error.message) });
})


//creation d'une nouvelle matiere
app.post("/create", (req, res, next) => {
    let matiere = new Matiere({
        ...req.body
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

                            items.push({ label: matiere.nom + ' - ' + diplome.titre + ' - ' + matiere.niveau + ' - ' + matiere.semestre, value: matiere._id })
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
                let tmp = sd2 - sd1
                let diff = {}
                //let nb = Math.floor((tmp % 86400000) / 3600000);
                tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates             
                tmp = Math.floor((tmp - (tmp % 60)) / 60);    // Nombre de minutes (partie entière)
                diff.min = tmp % 60;                    // Extraction du nombre de minutes

                tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
                diff.hour = tmp % 24;                   // Extraction du nombre d'heures
                let nb = diff.hour
                if (diff.min > 40)
                    nb++
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
            res.status(200).send({ rPlan, rCons })
        })
        .catch((error) => {
            console.error(error)
            res.status(400).send(error.message)
        });
});

app.get('/getAllByFormateurID/:formateur_id', (req, res, next) => {
    let listModules = []
    let listGroupes = []
    Seance.find({ formateur_id: req.params.formateur_id }).then(seances => {
        seances.forEach(s => {
            if (customIncludes(s.matiere_id, listModules) == false)
                listModules.push(s.matiere_id)
            s.classe_id.forEach(c_id => {
                if (customIncludes(c_id, listGroupes) == false)
                    listGroupes.push(c_id)
            })

        })
        Matiere.find({ _id: { $in: listModules } }).populate('formation_id').then(matieres => {
            Classe.find({ _id: { $in: listGroupes } }).then(groupes => {
                res.send({ matieres, groupes })
            })
        })
    })
})

function customIncludes(element, list) {
    let r = false
    list.forEach(ele => {
        if (ele == element) {
            r = true
        }
    })
    return r
}

module.exports = app;