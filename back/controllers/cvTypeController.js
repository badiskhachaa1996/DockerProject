const express = require("express");
const app = express();
const { CvType } = require("./../models/CvType");
const path = require('path');

const fs = require("fs")
const multer = require('multer');

app.disable("x-powered-by");

// upload du cv brute
const cvStorage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let id = req.body.id;
        let storage = `storage/cv/${id}`;

        if (!fs.existsSync(storage)) {
            fs.mkdirSync(storage, { recursive: true });
        }
        callBack(null, storage);
    },
    filename: (req, file, callBack) => {
        callBack(null, 'cv.pdf');
    }
});

const uploadCV = multer({ storage: cvStorage });
app.post("/upload-cv", uploadCV.single('file'), (req, res, next) => {
    const file = req.file;

    if (!file) {
        const error = new Error('Aucun fichier chargé');
        error.httpStatusCode = 400;
        return next(error);
    }

    res.status(200).send('file');
});

// ajout de CV
app.post("/post-cv", (req, res) => {
    const cv = new CvType({ ...req.body, date_creation: new Date() });

    // requete de securite pour verifier que l'utilisateur n'a pas de CV existant
    CvType.findOne({ user_id: cv.user_id })
        .then((response) => {
            if (response) {
                res.status(400).send(error);
            } else {
                cv.save()
                    .then((response) => { res.status(201).send(response); })
                    .catch((error) => { res.status(500).send(error.message); });
            }
        })
        .catch((error) => { res.status(500).send(error.message); })
});


// modif de cv
app.put("/put-cv", (req, res) => {

    const cv = new CvType({ ...req.body });
    CvType.findByIdAndUpdate(cv._id, cv, { new: true })
        .then((reponse) => { res.status(201).send(reponse); })
        .catch((error) => { res.status(400).send(error.message); });
});


// recuperation de la liste de cv
app.get("/get-cvs", (_, res) => {
    CvType.find()?.populate('user_id').populate('competences').populate('createur_id')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).send(error.message); });
});


// recuperation d'un cv par id du cv
app.get("/get-cv", (req, res) => {
    CvType.findOne({ _id: req.params.id })?.populate('user_id').populate('competences')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error.message); });
});


// recuperation d'un cv par id du user
app.get("/get-cv-by-user_id/:id", (req, res) => {
    CvType.findOne({ user_id: req.params.id })?.populate('user_id').populate('competences')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error.message); });
});

module.exports = app;