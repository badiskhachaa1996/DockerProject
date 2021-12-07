const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { Classe } = require("./../models/classe");
const { Ecole } = require("./../models/ecole");

//Création d'une nouveau classe 
app.post("/create", (req, res) => {
        //Sauvegarde d'une classe
        const classe = new Classe({
            nom: req.body.nom,
            nom_court: req.body.nom_court
        });

        classe.save((err, doc) => {
            res.send(doc);
        });
});


//Suppression d'une classe
app.get("/deleteById/:id", (req, res) => {
    Classe.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.send(err)
        }
        else {
            res.send(user)
        }
        
    })
});

//Modification d'une classe
app.post("/updateById/:id", (req, res) => {
    Classe.findByIdAndUpdate(req.params.id,
        {
            nom: req.body?.nom,
            nom_court: req.body?.nom_court
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(user)
            }
            
        })
});

//Récuperer une classe par ID

app.get("/getById/:id", (req, res) => {
    Classe.findOne({ _id: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});

//Récuperer tous les classes
app.get("/getAll", (req, res) => {
    Classe.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })
});
app.get("/hideById/:id", (req, res) => {
    Classe.findByIdAndUpdate(req.params.id,
        {
            active: false
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(user)
            }
            
        })
});

app.get("/showById/:id", (req, res) => {
    Classe.findByIdAndUpdate(req.params.id,
        {
            active: true
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(user)
            }
            
        })
});

//Récuperer tous les classes active
app.get("/seeAll", (req, res) => {
    Classe.find({ active: true })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })
});

//Récupérer une classe via une école
app.get("/getAllByEcoleID/:id", (req, res) => {
    Ecole.findById({ecole_id: req.params.id}).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});

module.exports = app;