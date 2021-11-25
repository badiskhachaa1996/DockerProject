const express = require("express");
const app = express();
const { Inscription } = require("./../models/inscription");

app.post("/create", (req, res) => {
    //Ajouter une inscription
    let data = req.body;
    let inscription = new Inscription({
        user_id: data.user_id,
        date_de_naissance:data.date_de_naissance,
        statut: data.statut,
        diplome:data.diplome,
        nationalite:data.nationalite,


        });
        inscription.save().then((inscriptionFromDB) => {
            res.status(200).send(inscriptionFromDB);
        }).catch((error) => {
            res.status(404).send(error);
        })

});

    //Modifier une inscription par ID
app.post("/editById/:id", (req, res) => {
    Inscription.findOneAndUpdate(req.params.id, 
        {
            date_de_naissance: req.body.date_de_naissance,
            annee_id: req.body.annee_id,
            statut: req.body.statut,
            diplome: req.body.diplome,
            nationalite: req.body.nationalite,
           

        }).then((inscriptionFromDB) => {
            res.status(201).send(inscriptionFromDB);
        }).catch((error) => {
            res.status(400).send(error);
        })


        app.get("/getAll", (req, res) => {
            //Récupérer toutes les inscription
            Inscription.find().then(result => {
                res.send(result.length > 0 ? result : [])
            })
            .catch((error) => { 
                console.error(error);
            })
        });

        app.get("/getById/:id", (req, res) => {
            //Récupérer une école via un ID
            Inscription.findOne({_id: req.params.id}).then((dataInscription) => {
                res.status(200).send({ dataInscription });
            }).catch((error) => {
                res.status(404).send(error);
            })
        })
});
module.exports = app;