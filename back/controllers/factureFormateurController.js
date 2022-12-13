const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const { FactureFormateur } = require("./../models/factureFormateur");
const { FactureFormateurMensuel } = require("./../models/factureFormateurMensuel");
const multer = require('multer');
const fs = require("fs")
var mime = require('mime-types')
const path = require('path');

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new FactureFormateur({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { res.status(400).send(error); });
})

app.post("/createMensuel", (req, res) => {
    delete req.body._id
    let f = new FactureFormateurMensuel({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { res.status(400).send(error); });
})

app.get("/getAll", (req, res, next) => {
    FactureFormateur.find().populate('formateur_id').populate({ path: 'seance_id', populate: { path: 'classe_id', populate: { path: 'diplome_id' } } })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getAllMensuel", (req, res, next) => {
    FactureFormateurMensuel.find().populate('formateur_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getAllByFormateurID/:formateur_id", (req, res, next) => {
    FactureFormateur.find({ formateur_id: req.params.formateur_id })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        if (!fs.existsSync('storage/facture/formateur/' + req.body.formateur_id + '/mensuel/')) {
            fs.mkdirSync('storage/facture/formateur/' + req.body.formateur_id + '/mensuel/', { recursive: true })
        }
        if (!req.body.mois)
            callBack(null, 'storage/facture/formateur/' + req.body.formateur_id + '/')
        else
            callBack(null, "storage/facture/formateur/" + req.body.formateur_id + '/mensuel/')
    },
    filename: (req, file, callBack) => {
        if (!req.body.mois)
            callBack(null, `${req.body._id}.${file.originalname.split('.').pop()}`)
        else
            callBack(null, `${req.body.mois}.${file.originalname.split('.').pop()}`)
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 10000000 } })


app.post('/uploadFile/:id', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        res.status(400).send(error)
    } else {

        res.status(201).json({ dossier: "dossier mise à jour" });
    }

}, (error) => { res.status(500).send(error); })

app.get("/download/:formateur_id/:_id", (req, res) => {
    let pathFile = "storage/facture/formateur/" + req.params.formateur_id
    fs.readdir(pathFile, (err, files) => {
        if (err) {
            return console.error(err);
        }
        console.log(files)
        files.forEach(function (file) {
            if (file.startsWith(req.params._id)) {
                const pathFileFinal = `${pathFile}/${file}`
                let fileFinal = fs.readFileSync(pathFileFinal, { encoding: 'base64' }, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                });
                res.status(201).send({ file: fileFinal, documentType: mime.contentType(path.extname(pathFileFinal)), fileName: file })
            }
        });
    });
});
app.get("/downloadMensuel/:formateur_id/:mois", (req, res) => {
    let pathFile = "storage/facture/formateur/" + req.params.formateur_id + "/mensuel/"
    fs.readdir(pathFile, (err, files) => {
        if (err) {
            return console.error(err);
        }
        files.forEach(function (file) {
            if (file.startsWith(req.params.mois)) {
                const pathFileFinal = `${pathFile}/${file}`
                let fileFinal = fs.readFileSync(pathFileFinal, { encoding: 'base64' }, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                });
                res.status(201).send({ file: fileFinal, documentType: mime.contentType(path.extname(pathFileFinal)), fileName: file })
            }
        });
    });
});

module.exports = app;