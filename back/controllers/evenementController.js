const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Evenement } = require("./../models/evenements");

app.post('/create', (req, res) => {
    let event = new Evenement({
        ...req.body
    })
    event.save().then(doc => {
        doc.populate('created_by').populate('list_inscrit').then(newDoc => {
            res.send(newDoc)
        })
    })
})

app.get('/getByID/:id', (req, res) => {
    Evenement.findById(req.params.id).populate('created_by').populate('list_inscrit').then(doc => {
        res.send(doc)
    })
})

app.get('/getAll', (req, res) => {
    Evenement.find().populate('created_by').populate('list_inscrit').then(docs => {
        res.send(docs)
    })
})

app.post('/updateInscrit/:id', (req, res) => {
    Evenement.findByIdAndUpdate(req.params.id, { list_inscrit: req.body.list_inscrit }, { new: true }).then(doc => {
        doc.populate('created_by').populate('list_inscrit').then(newDoc => {
            res.send(newDoc)
        })
    })
})
module.exports = app;
