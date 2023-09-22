const express = require("express");
const { FormulaireMI } = require("../models/FormulaireMI");
const { DateSejourMI } = require("../models/dateSejourMI");
const { DestinationMI } = require("../models/destinationMI");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");

app.post("/create", (req, res) => {
    delete req.body._id
    req.body.date_creation = new Date()
    let f = new FormulaireMI({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/getAll", (req, res, next) => {
    FormulaireMI.find().sort({ date_creation: -1 }).populate('destination').populate('dateSejour')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.delete('/delete/:id', (req, res) => {
    FormulaireMI.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.post("/DS/create", (req, res) => {
    delete req.body._id
    let f = new DateSejourMI({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.put("/DS/update", (req, res) => {
    DestinationMI.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.status(200).send(doc);
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/DS/getAll", (req, res, next) => {
    DateSejourMI.find().populate('destination')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.post("/DE/create", (req, res) => {
    delete req.body._id
    let f = new DestinationMI({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.put("/DE/update", (req, res) => {
    DestinationMI.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.status(200).send(doc);
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})



app.get("/DE/getAll", (req, res, next) => {
    DestinationMI.find()
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});



module.exports = app;