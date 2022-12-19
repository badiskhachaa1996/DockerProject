
const express = require("express");
const fs = require("fs");
const { Devoir } = require("../models/devoir");
const app = express(); //à travers ça je peux faire la creation des services
const { renduDevoir } = require('./../models/renduDevoir');
app.disable("x-powered-by");
app.post("/create", (req, res) => {
    delete req.body._id
    let devoir = new renduDevoir({ ...req.body });
    devoir.save()
        .then((data) => { res.status(201).send(data) })
        .catch((error) => { console.error(error); res.status(400).send(error); });

});
app.get("/valided/:devoir_id", (req, res) => {
    renduDevoir.findByIdAndUpdate(req.params.devoir_id, { verified: true }, { new: true }, (err, doc) => {
        if (err || !doc) {
            res.status(500).send(err)
        } else {
            res.status(201).send(doc)
        }
    })
})

const multer = require('multer');
var mime = require('mime-types')
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        if (!fs.existsSync('storage/devoir/' + req.body.devoir_id + '/' + req.body.rendu_id + '/')) {
            fs.mkdirSync('storage/devoir/' + req.body.devoir_id + '/' + req.body.rendu_id + '/', { recursive: true })
        }
        callBack(null, 'storage/devoir/' + req.body.devoir_id + '/' + req.body.rendu_id + '/')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
})
var upload = multer({ storage: storage })
app.post('/multipleFiles', upload.array('myFiles'), (req, res, next) => {
    const files = req.files
    console.log(files)
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})

app.get("/getByEtudiantDevoir/:etudiant_id/:devoir_id", (req, res) => {
    renduDevoir.findOne({ devoir_id: req.params.devoir_id, etudiant_id: req.params.etudiant_id }, (err, doc) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(doc)
        }
    })
})
module.exports = app;