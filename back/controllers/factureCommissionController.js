const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const { FactureCommission } = require("./../models/facture_commission");
const multer = require('multer');
const fs = require("fs")
var mime = require('mime-types')
const path = require('path');

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new FactureCommission({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { res.status(400).send(error); });
})

app.get("/getAll", (req, res, next) => {
    FactureCommission.find().populate('partenaire_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getAllByPartenaireID/:partenaire_id", (req, res, next) => {
    FactureCommission.find({ partenaire_id: req.params.partenaire_id }).populate('partenaire_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.post("/getAllByPartenaireIDs", (req, res, next) => {
    FactureCommission.find({ partenaire_id: { $in: req.body.partenaire_id } }).populate('partenaire_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        if (!fs.existsSync('storage/facture/commission/' + req.body._id + '/')) {
            fs.mkdirSync('storage/facture/commission/' + req.body._id + '/', { recursive: true })
        }
        callBack(null, 'storage/facture/commission/' + req.body._id + '/')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.originalname)
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
        FactureCommission.findByIdAndUpdate(req.params.id, { factureUploaded: true }, { new: true }, (err, doc) => {
            res.status(201).json(doc);
        })
    }

}, (error) => { res.status(500).send(error); })

app.get("/downloadFile/:facture_id", (req, res) => {
    let pathFile = "storage/facture/commission/" + req.params.facture_id
    fs.readdir(pathFile, (err, files) => {
        if (err) {
            return console.error(err);
        }
        let file = files[0]
        const pathFileFinal = `${pathFile}/${file}`
        let fileFinal = fs.readFileSync(pathFileFinal, { encoding: 'base64' }, (err) => {
            if (err) {
                return console.error(err);
            }
        });
        res.status(201).send({ file: fileFinal, documentType: mime.contentType(path.extname(pathFileFinal)), fileName: file })
    });
});

app.put("/update", (req, res) => {
    FactureCommission.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.send(doc)
    })
})

module.exports = app;