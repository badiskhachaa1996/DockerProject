const express = require("express");
const app = express();
app.disable("x-powered-by");
const { User } = require("./../models/user");
const { RachatBulletin } = require("./../models/RachatBulletin");


//creation d'une nouveau Rachat de Bulletin
app.post("/create", (req, res, next) => {
    let rb = new RachatBulletin({
        ...req.body
    });

    rb.save()
        .then((rbSaved) => { res.status(201).send(rbSaved) })
        .catch((error) => {
            console.error(error)
            res.status(400).send(error)
        });

});

//Mise à jour d'un Rachat de Bulletin
app.post("/update", (req, res, next) => {
    RachatBulletin.findByIdAndUpdate(req.body._id, {
        ...req.body
    }, { new: true }, (err, rbUpdated) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        } else
            res.status(201).send(rbUpdated)
    })
});

app.get("/getByID/:id", (req, res, next) => {
    RachatBulletin.findById(req.params.id).then(r => {
        res.status(201).send(r)
    })
});

app.get("/getByUserID/:user_id/:semestre", (req, res, next) => {
    RachatBulletin.find({ user_id: req.params.user_id, semestre: req.params.semestre }).then(r => {
        res.status(201).send(r.length > 0 ? r : [])
    })
});

app.get("/delete/:id", (req, res, next) => {
    console.log(req.params.id)
    RachatBulletin.findByIdAndDelete(req.params.id,{}, (err, rbDeleted) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        } else{
            console.log(rbDeleted)
            res.status(201).send(rbDeleted)
        }   
    })
});


module.exports = app;