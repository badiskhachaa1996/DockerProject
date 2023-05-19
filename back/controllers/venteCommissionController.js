const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const { Vente } = require("./../models/vente");
const multer = require('multer');
const fs = require("fs")
var mime = require('mime-types')
const path = require('path');

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new Vente({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { res.status(400).send(error); });
})

app.get("/getAll", (req, res, next) => {
    Vente.find().populate('partenaire_id').populate({ path: 'prospect_id', populate: { path: 'user_id' } }).populate('facture_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getAllByPartenaireID/:partenaire_id", (req, res, next) => {
    Vente.find({ partenaire_id: req.params.partenaire_id }).populate('partenaire_id').populate({ path: 'prospect_id', populate: { path: 'user_id' } }).populate('facture_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.post("/getAllByPartenaireIDs", (req, res, next) => {
    Vente.find({ partenaire_id: { $in: req.body.partenaire_id } }).populate('partenaire_id').populate({ path: 'prospect_id', populate: { path: 'user_id' } }).populate('facture_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.put("/update", (req, res) => {
    console.log({ ...req.body })
    Vente.findByIdAndUpdate(req.body._id, { ...req.body }, (err, doc) => {
        console.log(doc)
        if (err) {
            console.error(err); res.status(500).send(err);
        }
        else
            Vente.findById(req.body._id).populate('partenaire_id').populate({ path: 'prospect_id', populate: { path: 'user_id' } }).populate('facture_id')
                .then((formFromDb) => { res.status(200).send(formFromDb); })
                .catch((error) => { console.error(error); res.status(500).send(error); });
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    Vente.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    })
})
app.delete('/deleteByPaymentID/:id', (req, res) => {
    Vente.findOneAndRemove({ paiement_prospect_id: req.params.id }).then(doc => {
        res.send(doc)
    })
})

module.exports = app;