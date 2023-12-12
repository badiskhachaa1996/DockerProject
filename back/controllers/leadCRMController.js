const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const multer = require('multer');
const fs = require("fs")
var mime = require('mime-types')
const path = require('path');
const { LeadCRM } = require("../models/leadCRM");
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'ims@intedgroup.com',
        pass: 'InTeDGROUP@@0908',
    },
});
app.post("/create", (req, res) => {
    delete req.body._id
    let f = new LeadCRM({ ...req.body })
    LeadCRM.findOne({ email: req.body.email }).then(r => {
        if (!r)
            f.save()
                .then((FFSaved) => {
                    console.log(FFSaved.source, FFSaved)
                    if (FFSaved.source.startsWith('Site Web')) {
                        let ecole = FFSaved.source.replace('Site Web ', '')
                        console.log(ecole)
                        let mailOptions = {
                            from: 'ims@intedgroup.com',
                            to: FFSaved.email,
                            subject: '[IMS] - Suivi de votre demande de contact',
                            html: `
                    Cher/Chère ${FFSaved.nom},<br>
                    Nous vous remercions sincèrement d'avoir rempli le formulaire de contact de l'école ${ecole}.<br> Votre demande a été prise en compte, et nous sommes ravis de pouvoir vous accompagner dans votre démarche.<br>
                    Nous transmettons dès à présent votre requête à l'un de nos conseillers dédiés.<br> Celui-ci sera en contact avec vous prochainement pour répondre à toutes vos questions et vous guider à travers les différentes étapes du processus d'inscription.<br>
                    Chez ${ecole}, nous mettons un point d'honneur à offrir un service personnalisé et à répondre efficacement aux besoins de nos futurs étudiants.<br> Nous sommes impatients de vous fournir toutes les informations nécessaires pour faire de votre expérience chez nous une réussite.<br>
                    N'hésitez pas à nous faire part de toute question supplémentaire d'ici là.<br> Nous sommes là pour vous.<br>
                    Cordialement,<br>
                    `,
                            attachments: [{
                                filename: 'signature.png',
                                path: 'assets/ims-intedgroup-logo.png',
                                cid: 'red' //same cid value as in the html img src
                            }]
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.error(error);
                            }
                        });
                    }
                    FFSaved.populate('created_by').execPopulate().then(t => {
                        res.send(t)
                    }, error => {
                        console.log(error)
                    })

                })
                .catch((error) => { res.status(400).send(error); });
        else
            res.status(500).send("Lead existe déjà")
    })

})

app.get("/getByEmail/:email", (req, res, next) => {
    LeadCRM.findOne({ email: req.params.email })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/getOneByID/:id", (req, res, next) => {
    LeadCRM.findById(req.params.id)
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/getAll", (req, res, next) => {
    LeadCRM.find().populate('affected_to_member').populate('created_by')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getAllNonQualifies", (req, res, next) => {
    LeadCRM.find({ decision_qualification: 'Non qualifié' }).populate('affected_to_member').populate('created_by')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getAllPreQualifies", (req, res, next) => {
    LeadCRM.find({ decision_qualification: 'Pré-qualifié' }).populate('affected_to_member').populate('created_by')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getAllQualifies", (req, res, next) => {
    LeadCRM.find({ decision_qualification: 'Qualifié' }).populate('affected_to_member').populate('created_by')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getAllNonQualifiesByID/:id", (req, res, next) => {
    LeadCRM.find({ decision_qualification: 'Non qualifié', affected_to_member: req.params.id }).populate('affected_to_member').populate('created_by')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getAllPreQualifiesByID/:id", (req, res, next) => {
    LeadCRM.find({ decision_qualification: 'Pré-qualifié', affected_to_member: req.params.id }).populate('affected_to_member').populate('created_by')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getAllQualifiesByID/:id", (req, res, next) => {
    LeadCRM.find({ decision_qualification: 'Qualifié', affected_to_member: req.params.id }).populate('affected_to_member').populate('created_by')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getAllByID/:id", (req, res, next) => {
    LeadCRM.find({ affected_to_member: req.params.id }).populate('affected_to_member').populate('created_by')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getAllNonAffecte", (req, res, next) => {
    LeadCRM.find({ affected_to_member: null })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});


app.put("/update", (req, res) => {
    LeadCRM.findByIdAndUpdate(req.body._id, { ...req.body }, (err, doc) => {
        if (err) {
            console.error(err); res.status(500).send(err);
        }
        else
            LeadCRM.findById(req.body._id).populate('affected_to_member').populate('created_by')
                .then((formFromDb) => { res.status(200).send(formFromDb); })
                .catch((error) => { console.error(error); res.status(500).send(error); });
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    LeadCRM.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    })
})

app.get("/downloadFile/:_id/:file_id/:name", (req, res, next) => {
    let pathFile = `storage/leadCRM/${req.params.file_id}/${req.params._id}/${req.params.name}`;
    let file = fs.readFileSync(pathFile, { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    res.status(200).send({ file: file, documentType: mime.contentType(path.extname(pathFile)) })
});

const st = multer.diskStorage({
    destination: (req, file, callback) => {
        let id = req.body.document_id;
        let storage = `storage/leadCRM/${id}/${req.body.lead_id}`;

        if (!fs.existsSync(storage)) {
            fs.mkdirSync(storage, { recursive: true });
        }
        callback(null, storage);
    },
    filename: (req, file, callback) => {
        callback(null, `${file.originalname}`);
    }
});

const uploadConfig = multer({ storage: st });
app.post("/uploadFile", uploadConfig.single('file'), (req, res, next) => {
    const file = req.file;

    if (!file) {
        const error = new Error('Aucun fichier choisis');
        error.httpStatusCode = 400;
        return next(error);
    }

    res.status(201).send({ message: "C'est bon" });
});

app.post("/insertDB", (req, res) => {
    LeadCRM.insertMany(req.body.toInsert).then(docs => {
        req.body.toUpdate.forEach(val => {
            LeadCRM.findByIdAndUpdate(val._id, { ...val }).exec()
        })
        res.send(docs)
    })
})

app.get('/moveFiles/:prospect_id/:lead_id', (req, res) => {
    if (!fs.existsSync('storage/prospect/admin/' + req.params.prospect_id + '/')) {
        fs.mkdirSync('storage/prospect/admin/' + req.params.prospect_id + '/', { recursive: true });
    }
    LeadCRM.findById(req.params.lead_id).then(lead => {
        console.log(lead.documents)
        lead.documents.forEach(val => {
            let oldPath = `storage/leadCRM/${val._id}/${req.params.lead_id}/${val.path}`
            let newPath = 'storage/prospect/admin/' + req.params.prospect_id + '/' + val.path

            fs.rename(oldPath, newPath, function (err) {
                if (err) {
                    console.error(err)
                }
            })
        })
        res.send(lead.documents)
    })

})

module.exports = app;
