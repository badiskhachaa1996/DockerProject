const express = require("express");
const { DisponbiliteEtudiant } = require("../models/disponibiliteEtudiant");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");

app.post("/create", (req, res) => {
    delete req.body._id
    let df1 = new Date(req.body.from)
    let df2 = new Date(req.body.from)
    let dt1 = new Date(req.body.to)
    let dt2 = new Date(req.body.to)
    df2.setMinutes(df2.getMinutes() + 1)
    dt2.setMinutes(dt2.getMinutes() + 1)
    DisponbiliteEtudiant.findOne({
        user_id: req.body.user_id, from: {
            $gte: df1,
            $lt: df2
        }, to: {
            $gte: dt1,
            $lt: dt2
        }
    }).then(dispo => {
        if (!dispo) {
            let f = new DisponbiliteEtudiant({ ...req.body })
            f.save()
                .then((TFsaved) => { res.status(201).send(TFsaved) })
                .catch((error) => { console.error(error); res.status(500).send(error); });
        } else {
            DisponbiliteEtudiant.findByIdAndUpdate(dispo._id, { ...req.body }).then(r => {
                res.status(201).send(dispo)
            })
        }
    })

})

app.get("/getByID/:id", (req, res, next) => {
    DisponbiliteEtudiant.findById(req.params.id).populate('user_id')
        .then((data) => { res.status(200).send(data); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/getAll", (req, res, next) => {
    DisponbiliteEtudiant.find().populate('user_id').sort({ from: -1 })
        .then((arrayData) => { res.status(200).send(arrayData); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/getAllByUSERID/:user_id", (req, res, next) => {
    DisponbiliteEtudiant.find({ user_id: req.params.user_id }).populate('user_id').sort({ from: -1 })
        .then((arrayData) => { res.status(200).send(arrayData); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/update", (req, res) => {
    DisponbiliteEtudiant.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.status(200).send(doc);
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    DisponbiliteEtudiant.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

module.exports = app;