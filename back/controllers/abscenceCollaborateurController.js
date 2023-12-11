const express = require('express');
const app = express();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
app.disable("x-powered-by");
const { AbscenceCollaborateur } = require('./../models/abscenceCollaborateur');
const { User } = require("./../models/user");

//upload du justificatif
const justificatifStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        let id = req.body.id;
        let storage = `storage/justificatifs/${id}`;

        if (!fs.existsSync(storage)) {
            fs.mkdirSync(storage, { recursive: true });
        }
        callback(null, storage);
    },
    filename: (req, file, callback) => {
        callback(null, `${file.originalname}`);
    }
});

const uploadJustificatifFile = multer({ storage: justificatifStorage });
app.post("/upload-justificatif-file", uploadJustificatifFile.single('file'), (req, res, next) => {
    const file = req.file;

    if (!file) {
        const error = new Error('Aucun fichier choisis');
        error.httpStatusCode = 400;
        return next(error);
    }

    res.status(201).send('file');
});


//ajout d'une nouvelle abscence
app.post("/post-absence", (req, res) => {
    const abscence = new AbscenceCollaborateur({ ...req.body });
    abscence.save()
        .then((response) => { res.status(201).send(response); })
        .catch((error) => { res.status(400).send(error.message); })
});

//Modification d'une abscence
app.put("/put-abscence", (req, res) => {
    AbscenceCollaborateur.updateOne({ _id: req.body._id }, { ...req.body })
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).send(error.message); });
});

//Recuperation de toute les abscence
app.get("/get-all-populate", (_, res) => {
    AbscenceCollaborateur.find()?.populate('user_id')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).send(error.message); });
});

//Recuperattion de tout les abscence d'un utilisateur
app.get("/get-all-by-user-id-populate/:user_id", (req, res) => {
    AbscenceCollaborateur.find({ user_id: req.params.user_id })?.populate('user_id')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error.message); });
});

//Recuperation d'une seul abscence via l'id de l'abscence
app.get("/get-by-id-populate/:user_id", (req, res) => {
    AbscenceCollaborateur.findOne({ _id: req.params.user_id })?.populate('user_id')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error.message); });
});

//Methode de téléchargement du justificatif, l'id correspond à celui du justificatif et non du user
app.get("/download-file/:id/:fileName", (req, res) => {
    let filestring = path.join('storage', 'justificatifs', req.params.id.toString())
    if (!fs.existsSync(filestring))
        fs.mkdirSync(filestring, { recursive: true });

    let filePath = path.join('storage', 'justificatifs', req.params.id.toString(), req.params.fileName.toString())
    let fileExtention = filePath.toString().slice(((filePath.toString().lastIndexOf(".") - 1) + 2));

    try {
        let file = fs.readFileSync(filePath, { encoding: 'base64' }, (error) => {
            if (error) {
                res.status(400).json({ error: error });
            }
        });

        res.status(200).json({ file: file, extension: fileExtention });
    } catch (e) {
        res.status(200).json({ error: e })
    }
});

module.exports = app;