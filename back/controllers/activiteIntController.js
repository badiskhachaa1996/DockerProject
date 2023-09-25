const express = require("express");
const { ActualiteInt } = require("../models/actualiteInt");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'noreply@intedgroup.com',
        pass: 'Fox86354',
    },
});

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new ActualiteInt({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/getAll", (req, res, next) => {
    ActualiteInt.find().sort({ date_creation: -1 })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/update", (req, res) => {
    ActualiteInt.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.status(200).send(doc);
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    ActualiteInt.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})
app.post('/sendEmail/:id', (req, res) => {
    ActualiteInt.findById(req.params.id).then(act => {
        let mailOptions = {
            from: "noreply@intedgroup.com",
            to: req.body.emailList,
            subject: act.titre,
            html: act.description
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
                res.status(500).send(error)
            } else {
                res.send(act)
            }
        });
    })
})
module.exports = app;