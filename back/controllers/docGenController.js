const express = require("express");
const { DocumentInternational } = require("../models/documentInternational");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
app.post("/create", (req, res) => {
    delete req.body._id
    let f = new DocumentInternational({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/getAll", (req, res, next) => {
    DocumentInternational.find().sort({ date_creation: -1 }).populate('prospect_id').populate('user_id').populate('ecole')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/update", (req, res) => {
    DocumentInternational.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.status(200).send(doc);
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    DocumentInternational.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

const fs = require("fs");
const multer = require("multer");
var mime = require('mime-types')
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callBack) => {
            if (!fs.existsSync('storage/document_generated/' + req.body.id + '/')) {
                fs.mkdirSync('storage/document_generated/' + req.body.id + '/', { recursive: true })
            }
            callBack(null, 'storage/document_generated/' + req.body.id + '/')
        },
        filename: (req, file, callBack) => {
            callBack(null, file.originalname)
        }
    })
    , limits: { fileSize: 20000000 }
})


app.post('/upload/:id', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        res.status(400).send(error)
    } else {
        DocumentInternational.findByIdAndUpdate(req.params.id, { filename: file.originalname }, { new: true }, (err, doc) => {
            res.status(201).json(doc);
        })
    }

}, (error) => { res.status(500).send(error); })

app.get("/download/:id/:filename", (req, res) => {
    let pathFile = "storage/document_generated/" + req.params.id + '/' + req.params.filename
    let fileFinal = fs.readFileSync(pathFile, { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });
    res.status(201).send({ file: fileFinal, documentType: mime.contentType(path.extname(pathFile)) })
});
module.exports = app;