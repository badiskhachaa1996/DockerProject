const express = require('express');
const app = express();
app.disable("x-powered-by");
const {AdmissionFormDubai} = require('./../models/AdmissionFormDubai');

// méthode d'ajout
app.post("/post-dubai-admission", (req, res) => {
    const data = new AdmissionFormDubai({ ...req.body });

    data.save()
    .then(() => { res.status(201).json({successMsg: 'Your request has been taken into account, you will be contacted as soon as possible.'}) })
    .catch((error) => { res.status(500).json({error: error, errorMsg: 'Unable to respond to your request'}) });
});

// méthode de recuperation de la liste des admissions
app.get("/get-admissions", (req, res) => {
    AdmissionFormDubai.find()
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).json({error: error, errorMsg: 'Unable to get the list of admissions'}) });
});

// méthode de recuperation de la liste des admissions
app.get("/get-admission/:id", (req, res) => {
    const { id } = req.params;
    AdmissionFormDubai.findOne({_id: id})
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).json({error: error, errorMsg: 'Unable to get this admission'}) });
});


module.exports = app;