const express = require("express");
const app = express();
const { AnneeScolaire }  = require("./../models/anneeScolaire");


app.post("/create", (req, res) =>{
    //Ajouter une année scolaire
    let data = req.body;
    let anneeScolaire = new AnneeScolaire({
        libelle: data.libelle,
        etat: data.etat,
    });
    console.log(data)
    anneeScolaire.save().then((anneeScolaireFromDB) =>{
        res.status(200).send(anneeScolaireFromDB);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.post("/updateById/:id", (req, res) => {
    //Modifier une année scolaire
    AnneeScolaire.updateById(req.params.id,
        {
            libelle : req.body.libelle,
        }, { new: true }, (err,anneeScolaire) => {
            if (err) {
                res.send(err)
            }
            res.send(anneeScolaire)
        });
});

app.get("/getAll", (req, res) => {
    //Récupérer toutes les années scolaire
    AnneeScolaire.find().then(result => {
        res.send(result.length > 0 ? result : [])
    })
    .catch(err => {
        console.error(err);
    })
})

app.get("/getById/:id", (req, res) => {
    //Récupérer une année scolaire via un ID
    AnneeScolaire.findOne({_id: req.params.id}).then((dataAnneeScolaire) => {
        res.status(200).send({ dataAnneeScolaire });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
})

app.get("/archivee/:id", (req, res) => {
    //Modifier une année scolaire
    AnneeScolaire.updateById(req.params.id,
        {
            etat : "Archive",
        }, { new: true }, (err,anneeScolaire) => {
            if (err) {
                res.send(err)
            }
            res.send(anneeScolaire)
        });
});


module.exports = app;