const express = require("express");
const app = express();
app.disable("x-powered-by");
const { CampusRework } = require("../models/CampusRework");

app.post("/create", (req, res) => {
    //Ajout d'un campus
    console.log(req.body)
    let campus = new CampusRework({
        ...req.body
    });
    campus.save().then((campusFromDB) => {
        campusFromDB.populate('ecoles.ecole_id').execPopulate().then(t => {
            res.send(t)
        }, error => {
            console.log(error)
        })
    }).catch((error) => {
        res.status(404).send(error);
    });
});

app.put("/update/:id", (req, res) => {
    //Modifier un campus 
    CampusRework.findByIdAndUpdate(req.params.id,
        {
            ...req.body
        }, { new: true }, (err, campusFromDB) => {
            if (err) {
                res.send(err)
            }
            else {
                campusFromDB.populate('ecoles.ecole_id').execPopulate().then(t => {
                    res.send(t)
                }, error => {
                    console.log(error)
                })
            }
        });
});

app.delete("/delete/:id", (req, res) => {
    //Récupérer tous les campus
    CampusRework.findByIdAndRemove(req.params.id)
        .then((result) => { res.status(200).send(result); })
        .catch((err) => { res.status(500).send(err); })
});

app.get("/getAll", (req, res) => {
    //Récupérer tous les campus
    CampusRework.find().populate('ecoles.ecole_id')
        .then((result) => {  res.status(200).send(result); })
        .catch((err) => { res.status(500).send('Impossible de recuperer la liste des classes'); })
});



app.get("/get/:id", (req, res) => {
    //Récupérer un campus via un id
    CampusRework.find({ _id: req.params.id }).populate('ecoles.ecole_id').then((datacampus) => {
        res.status(200).send(datacampus);
    }).catch((error) => {
        res.status(404).send(error);
    })
});


app.get("/getAllByEcole/:id", (req, res) => {
    //Récupérer un campus via une école
    CampusRework.find({ ecole_id: { $in: [req.params.id] } }).populate('ecoles.ecole_id').then((datacampus) => {
        res.status(200).send(datacampus);
    }).catch((error) => {
        res.status(404).send(error);
    })
});

module.exports = app;

