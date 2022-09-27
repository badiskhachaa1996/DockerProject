const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const { Dashboard } = require("./../models/dashboard");

app.post("/create", (req, res) => {
    //Sauvegarde d'une classe
    delete req.body._id
    req.body.user_id = req.body.user_id._id
    let d = new Dashboard(
        {
            ...req.body
        });

    d.save()
        .then((dsaved) => { res.status(201).send(dsaved) })
        .catch((error) => {
            console.error(error)
            res.status(400).send(error);
        });
});

app.post('/addLinks/:_id', (req, res) => {
    Dashboard.findByIdAndUpdate(req.params._id, { links: req.body.links }, { new: true }, (err, newDashboard) => {
        if (err) {
            console.error(err)
            res.status(500).send(err)
        } else {
            res.status(201).send(newDashboard)
        }

    })
})

app.get('/getByUserID/:user_id', (req, res) => {
    Dashboard.findOne({ user_id: req.params.user_id }, {}, (err, dash) => {
        if (err) {
            console.error(err)
            res.status(500).send(err)
        } else {
            if (dash)
                res.status(201).send(dash)
            else {
                let d = new Dashboard({
                    user_id: req.params.user_id
                })
                d.save().then(doc => {
                    res.status(201).send(doc)
                })
            }

        }

    })
})

module.exports = app;