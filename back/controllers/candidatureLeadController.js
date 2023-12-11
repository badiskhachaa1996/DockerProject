const express = require("express");
const { CandidatureLead } = require("../models/candidatureLead");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const fs = require("fs");
const path = require('path');
var mime = require('mime-types')
app.post("/create", (req, res) => {
    let f = new CandidatureLead({ ...req.body, signature: req.body._id + ".png" })
    f.save()
        .then((FFSaved) => {
            CandidatureLead.findById(FFSaved._id).populate('lead_id').then(newCandidature => {
                if (req.body.signature && req.body.signature != null && req.body.signature != '') {
                    if (!fs.existsSync("storage/signatureCandidature/"))
                        fs.mkdirSync("storage/signatureCandidature/", { recursive: true });
                    fs.writeFile("storage/signatureCandidature/" + FFSaved._id + ".png", req.body.signature, 'base64', function (err2) {
                        if (err2) {
                            console.error(err2);
                        }
                    });
                }
                res.status(201).send(newCandidature)
            })

        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get('/downloadSignature/:id', (req, res) => {
    if (!fs.existsSync("storage/signatureCandidature/"))
        fs.mkdirSync("storage/signatureCandidature/", { recursive: true });
    let pathFile = "storage/signatureCandidature/" + req.params.id + ".png"
    let file = fs.readFileSync(
        pathFile,
        { encoding: "base64" },
        (err2) => {
            if (err2) {
                return console.error(err2);
            }
        }
    );
    res.send({ file: file, documentType: mime.contentType(path.extname(pathFile)) });
})

app.get("/getAll", (req, res, next) => {
    CandidatureLead.find().populate('lead_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get('/getByLead/:id', (req, res) => {
    CandidatureLead.findOne({ lead_id: req.params.id }).populate('lead_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });

})

app.put("/update", (req, res) => {
    CandidatureLead.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        if (doc)
            CandidatureLead.findById(doc._id).populate('lead_id').then(newCandidature => {
                res.status(201).send(newCandidature)
            })
        else {
            console.error(err);
            res.status(500).send({ ...req.body, err });
        }

    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    CandidatureLead.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

module.exports = app;