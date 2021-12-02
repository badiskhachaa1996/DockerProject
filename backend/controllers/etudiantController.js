const express = require("express");
const app = express();
const { Etudiant } = require("./../models/etudiant");


app.post("create", (req, res) => {
    //Ajouter un étudiant
    let data = req.body;
    let etudiant = new Etudiant({
        user_id: data.user_id,
        classe_id: data.classe_id,
        status: data.status,
    });
    etudiant.save().then((etudiantFromDB) => {
        res.status(200).send({etudiantFromDB});
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post("edit/:id", (req, res) => {
    //Modifer un étudiant
    Etudiant.findByIdAndUpdate(req.params.id,
        {
            classe_id: req.body.classe_id,
            status: req.body.status,

        }, { new: true }, (err, etudiant) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(etudiant)
            }
        });
});

app.get("/getAll", (req, res) => {
    //Récupérer tous les étudiants
    Etudiant.find().then(result => {
        res.send(result.length > 0 ? result : [])
    })
    .catch(error => {
        console.error(error)
    })
});

app.get("/getById/:id", (req, res) => {
    //Récupérer un etudiant via un id
    Etudiant.find({etudiant_id: req.params.id}).then((dataetudiant) => {
        res.status(200).send( dataetudiant );
    }).catch((error) => {
        res.status(404).send(error);
    })
});

app.get("/getAllByClasse/:id", (req, res) => {
    //Récupérer un etudiant via une classe
    Etudiant.find({classe_id: req.params.id}).then((dataetudiant) => {
        res.status(200).send( dataetudiant );
    }).catch((error) => {
        res.status(404).send(error);
    })
});

module.exports = app;
