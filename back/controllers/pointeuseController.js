const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");;
const { Pointeuse } = require("../models/Pointeuse");
const { PointeuseData } = require("../models/PointeuseData");

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new Pointeuse({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/getAll", (req, res, next) => {
    Pointeuse.find()
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/update", (req, res) => {
    Pointeuse.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.status(200).send(doc);
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    Pointeuse.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get('/getData', (req, res, next) => {
    PointeuseData.find()
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get('/getDataFromSN/:sn', (req, res, next) => {
    PointeuseData.findOne({ serial_number: req.params.sn })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});
module.exports = app;