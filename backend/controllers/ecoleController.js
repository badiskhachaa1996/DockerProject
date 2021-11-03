const express = require("express");
const ecole = require("./../models/ecole");
const app = express();
const { Ecole } = require("./../models/ecole");

app.post("/createecole", (req, res) => {
    //Ajouter une école
    let data = req.body;
    let ecole = new Ecole({
        libelle: data.libelle,
        annee_id: data.annee_id,
        ville: data.ville,
        pays: data.pays,
        adresse: data.adresse,
        email: data.email,
        site: data.site,
        telephone: data.telephone,
        });
        ecole.save().then((ecoleFromDB) => {
            res.status(200).send(ecoleFromDB);
        }).catch((error) => {
            res.status(404).send(error);
        })

});

app.post("/editById/:id", (req, res) => {
    Ecole.updateById(req.params.id, 
        {
            libelle: req.body.libelle,
            annee_id: req.body.annee_id,
            ville: req.body.ville,
            pays: req.body.pays,
            adresse: req.body.adresse,
            email: req.body.email,
            site: req.body.site,
            telephone: req.body.telephone

        }).then((ecoleFromDB) => {
            res.status(201).send(ecoleFromDB);
        }).catch((error) => {
            res.status(400).send(error);
        })

});

app.get("/getAll", (req, res) => {
    //Récupérer toutes les écoles
    Ecole.find().then(result => {
        res.send(result.length > 0 ? result : [])
    })
    .catch((error) => { 
        console.error(error);
    })
});

app.get("/getById/:id", (req, res) => {
    //Récupérer une école via un ID
    Ecole.findOne({_id: req.params.id}).then((dataEcole) => {
        res.status(200).send({ dataEcole });
    }).catch((error) => {
        res.status(404).send(error);
    })
})

app.get("/getAllByAnnee/:id", (req, res) => {
    //Récupérer une école via une année scolaire
    Ecole.find({annee_id: req.params.id}).then((dataAnneeScolaire) => {
        res.status(200).send( dataAnneeScolaire );
    }).catch((error) => {
        res.status(404).send(error);
    })
});

module.exports = app;
