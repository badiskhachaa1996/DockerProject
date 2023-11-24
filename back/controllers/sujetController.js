const express = require("express");
const app = express(); //à travers ça je peux faire la creation des Sujets
const { Sujet } = require("./../models/sujet");
app.disable("x-powered-by");

app.post("/addsujet", (req, res) => {
    //Crée un sujet
    let data = req.body;
    let sujet = new Sujet({
        label: data.label,
        service_id: data.service_id
    })
    sujet.save().then((sujetFromDb) => {
        res.status(200).send(sujetFromDb);
    }).catch((error) => {
        res.status(400).send(error);
    })
});

app.get("/getAll", (req, res) => {
    //Récupérer tous les sujets
    Sujet.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })

})

app.get("/getAllByServiceID/:id", (req, res) => {
    //Récupérer tous les sujets
    Sujet.find({ service_id: req.params.id })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })

})

app.get("/getById/:id", (req, res) => {
    //Récupérer un sujet via ID
    Sujet.findOne({ _id: req.params.id }).then((dataSujet) => {
        res.status(200).send({ dataSujet });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});
app.get("/getByLabel/:label", (req, res) => {
    //Récupérer un sujet via ID
    Sujet.findOne({ label: req.params.label }).populate('service_id').then((dataSujet) => {
        res.status(200).send(dataSujet);
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});
app.post("/updateById/:id", (req, res) => {
    //Mettre à jour un sujet via ID
    Sujet.findByIdAndUpdate(req.params.id,
        {
            label: req.body.label,

        }, { new: true }, (err, sujet) => {
            if (err) {
                res.send(err)
            }
            res.send(sujet)
        })
});

app.get("/deleteById/:id", (req, res) => {
    //Supprimer un sujet via ID
    Sujet.findByIdAndRemove(req.params.id, (err, sujet) => {
        if (err) {
            res.send(err)
        }
        res.send(sujet)
    })
});

app.get("/getPopulate/:id", (req, res) => {
    //Récupérer un sujet via ID
    Sujet.findById(eq.params.id).populate('service_id').then((dataSujet) => {
        res.status(200).send(dataSujet);
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});

app.get("/getAllPopulate", (req, res) => {
    //Récupérer tous les sujets
    Sujet.find().populate('service_id')
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })

})
module.exports = app;
