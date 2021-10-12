const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { Classe } = require("./../models/classe");

//Création d'un nouveau classe 
app.post("/create", (req, res) => {
        //Sauvegarde du classe
        const classe = new Classe({
            nom: req.body.nom,
            nom_court: req.body.nom_court
        });

        classe.save((err, doc) => {
            res.send(doc);
        });
});


//Suppression d'un classe
app.post("/deleteById/:id", (req, res) => {
    Classe.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.send(err)
        }
        res.send(user)
    })
});

//Modification d'un classe
app.post("/updateById/:id", (req, res) => {
    Classe.findByIdAndUpdate(req.params.id,
        {
            nom: req.body?.nom,
            nom_court: req.body?.nom_court
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            res.send(user)
        })
});

//Récuperer un classe par ID

app.post("/getById/:id", (req, res) => {
    Classe.findOne({ _id: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});

//Récuperer tous les classes
app.post("/getAll", (req, res) => {
    Classe.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })
});
app.post("/hideById/:id", (req, res) => {
    Classe.findByIdAndUpdate(req.params.id,
        {
            active: false
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            res.send(user)
        })
});

app.post("/showById/:id", (req, res) => {
    Classe.findByIdAndUpdate(req.params.id,
        {
            active: true
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            res.send(user)
        })
});

//Récuperer tous les classes active
app.post("/seeAll", (req, res) => {
    Classe.find({ active: true })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })
});

module.exports = app;