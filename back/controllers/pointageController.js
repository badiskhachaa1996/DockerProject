const express = require("express");
const { PointageData } = require("../models/PointageData");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");

app.get("/getAll", (req, res, next) => {
    PointageData.find().sort({ date_creation: -1 })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});


app.delete('/delete/:id', (req, res) => {
    PointageData.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

module.exports = app;