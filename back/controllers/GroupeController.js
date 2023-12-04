const express = require("express");
const { Groupe } = require("../models/Groupe");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new Groupe({ ...req.body })
    f.save()
        .then((FFSaved) => {
            FFSaved.populate('formation_id').populate('campus_id').populate('ecole_id').execPopulate(r => {
                res.status(201).send(r)
            })
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/getAll", (req, res, next) => {
    Groupe.find().sort({ date_creation: -1 }).populate('formation_id').populate('campus_id').populate('ecole_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/update", (req, res) => {
    Groupe.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        Groupe.findById(req.body._id).populate('formation_id').populate('campus_id').populate('ecole_id')
            .then((formFromDb) => { res.status(200).send(formFromDb); })
            .catch((error) => { console.error(error); res.status(500).send(error); });
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    Groupe.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})
module.exports = app;