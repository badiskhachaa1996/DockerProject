const express = require("express");
const mongoose = require("mongoose")
const Sujet = mongoose.model('sujet')
const { Demande_events } = require("./../models/demande_event");
const app = express();
app.disable("x-powered-by");
const { sourceForm } = require("../models/sourceForm");

app.post("/create", (req, res, next) => {

    //création d'un nvx event
    let data = req.body;
    let NewEvent = new sourceForm(
        {
            ...data
        });

    NewEvent.save()
        .then((eventSaved) => {
            res.status(201).json({ success: "Inscription prise en compte" })
        })
        .catch((error) => {
            res.status(400).json({ msg: "Erreur réessayez plus tard", error })
        });
})

app.get("/getAll", (req, res, next) => {
    sourceForm.find()
        .then((result) => { res.status(200).send(result); })
        .catch((error) => { req.status(500).json({ error: "Probleme porte ouverte " + error.message }); });
})

app.get('/clearDuplicate', async (req, res, next) => {
    //Supprimer les doublons de prospects
    let agg = await sourceForm.aggregate([
        { "$group": { "_id": "$email", "count": { "$sum": 1 } } },
        { "$match": { "_id": { "$ne": null }, "count": { "$gt": 1 } } },
        { "$project": { "email": "$_id", "_id": 0 } }
    ])
    let r = []
    for (const doc of agg) {
        if (doc.email != '' && doc.email != ' ' && doc.email != null)
            await sourceForm.find({ email: doc.email }, (err, doc) => {
                var mapped = doc.map(function (doc) {
                    return doc._id;
                });
                let toDelete = mapped.slice(1)
                r.push(doc)
                sourceForm.remove({ _id: toDelete }, (err) => {
                    if (err)
                        console.error(err)
                }).exec()
            })
    }
    res.status(201).send(r)
})

module.exports = app;