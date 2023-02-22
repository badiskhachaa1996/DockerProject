const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Evenement } = require("./../models/evenements");

app.post('/create', (req, res) => {
    let event = new Evenement({
        ...req.body
    })
    event.save().then(doc => {
        Evenement.findById(doc._id).populate('created_by').populate('list_inscrit').then(newDoc => {
            res.send(newDoc)
        })
    })
})

app.put('/update/:id', (req, res) => {
    Evenement.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true}).populate('created_by').populate('list_inscrit').then(doc => {
        res.send(doc)
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
    Evenement.findByIdAndUpdate(req.params.id, { list_inscrit: req.body.list_inscrit }, { new: true }).populate('created_by').populate('list_inscrit').then(doc => {
        res.send(doc)
    })
})
module.exports = app;
