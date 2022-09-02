const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Campus } = require("./../models/campus");

app.post("/createcampus", (req, res) => {
    //Ajout d'un campus
    let data = req.body;
    let campus = new Campus({
        ...data
    });
    campus.save().then((campusFromDB) => {
        res.status(200).send(campusFromDB);
    }).catch((error) => {
        res.status(404).send(error);
    });
});

app.post("/editById/:id", (req, res) => {
    //Modifier un campus 
    Campus.findByIdAndUpdate(req.params.id,
        {
            ...req.body
        }, { new: true }, (err, campus) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(campus)
            }

        });
});

app.get("/getAll", (req, res) => {
    //Récupérer tous les campus
    Campus.find()
        .then((result) => { res.status(200).send(result); })
        .catch((err) => { res.status(500).send('Impossible de recuperer la liste des classes'); })
});


app.get("/getAllPopulate", (req, res) => {
    //Récupérer tous les campus
    Campus.find().populate('ecole_id')
        .then((result) => { res.status(200).send(result); })
        .catch((err) => { res.status(500).send('Impossible de recuperer la liste des classes'); })
});



app.get("/getById/:id", (req, res) => {
    //Récupérer un campus via un id
    Campus.find({ _id: req.params.id }).then((datacampus) => {
        res.status(200).send(datacampus);
    }).catch((error) => {
        res.status(404).send(error);
    })
});

app.get("/getAllByEcole/:id", (req, res) => {
    //Récupérer un campus via une école
    Campus.find({ ecole_id: req.params.id }).then((datacampus) => {
        res.status(200).send(datacampus);
    }).catch((error) => {
        res.status(404).send(error);
    })
});

module.exports = app;

