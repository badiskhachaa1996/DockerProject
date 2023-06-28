const express = require("express");
const bcrypt = require("bcryptjs");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const nodemailer = require('nodemailer');
var mime = require('mime-types')
const path = require('path');
const { Mail } = require("../models/mail");
const fs = require("fs");
const multer = require("multer");
const { MailType } = require("../models/MailType");
const { MailAuto } = require("../models/mailAuto");
const { HistoriqueEmail } = require("../models/HistoriqueEmail");
const crypto = require('crypto');
let superSecretKey = "573648abf72c7b4b74380d36d2d7b699"
let superSecretIV = crypto.randomBytes(16)

//Partie configurations des emails

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new Mail({ ...req.body, password: req.body.password })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/getAll", (req, res, next) => {
    Mail.find()
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/update", (req, res) => {
    Mail.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.status(200).send(doc);
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    Mail.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get('/getAllSignature', (req, res) => {
    let ids = fs.readdirSync("storage/mail")
    let fileDic = {}
    ids.forEach(id => {
        let filenames = fs.readdirSync("storage/mail/" + id)
        if (filenames)
            fileDic[id] = {
                file: fs.readFileSync("storage/mail/" + id + "/" + filenames[0], { encoding: 'base64' }, (err) => {
                    if (err) return console.error(err);
                }),
                extension: mime.contentType(path.extname("storage/mail/" + id + "/" + filenames[0])),
                url: ""
            }
    })
    res.status(200).send({ files: fileDic, ids })
})

//Sauvegarde de la photo de profile
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let id = req.body.id;
        if (!fs.existsSync("storage/mail/" + id + "/")) {
            fs.mkdirSync("storage/mail/" + id + "/", { recursive: true });
        }
        callBack(null, "storage/mail/" + id + "/");
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`);
    },
});

const upload = multer({ storage: storage, limits: { fileSize: 20000000 } });
//Sauvegarde de la photo de profile
app.post("/uploadSignature", upload.single("file"), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error("No File");
        error.httpStatusCode = 400;
        return next(error);
    }
    Mail.findById(req.body.id, (err, email) => {
        try {
            if (
                fs.existsSync(
                    "storage/mail/" + req.body.id + "/" + email.signature_file
                )
            )
                fs.unlinkSync(
                    "storage/mail/" + req.body.id + "/" + email.signature_file
                );
            //file removed
        } catch (err2) {
            console.log("Un fichier n'existait pas avant");
            if (err2)
                console.error(err2);
        }
    });

    Mail.findOneAndUpdate(
        { _id: req.body.id },
        {
            signature_file: file.filename
        },
        (errUser, user) => {
            if (errUser)
                console.error(errUser);
            //Renvoie de la photo de profile au Front pour pouvoir l'afficher
            res.send({ message: "Photo mise à jour" });
        }
    );
});

//Partie Mail types 
app.post("/MT/create", (req, res) => {
    delete req.body._id
    let f = new MailType({ ...req.body, date_creation: new Date() })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/MT/getAll", (req, res, next) => {
    MailType.find().sort({ date_creation: -1 })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/MT/update", (req, res) => {
    MailType.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.status(200).send(doc);
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/MT/delete/:id', (req, res) => {
    MailType.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

//Partie Mail Auto 
app.post("/MA/create", (req, res) => {
    delete req.body._id
    let f = new MailAuto({ ...req.body, date_creation: new Date() })
    f.save()
        .then((FFSaved) => {
            MailAuto.findById(FFSaved._id).populate('mailType').populate('mail').then(data => {
                res.status(201).send(data)
            })
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/MA/getAll", (req, res, next) => {
    MailAuto.find().populate('mailType').populate('mail')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/MA/update", (req, res) => {
    MailAuto.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        MailAuto.findById(doc._id).populate('mailType').populate('mail').then(data => {
            res.status(201).send(data)
        })
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/MA/delete/:id', (req, res) => {
    MailAuto.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

//Partie Mail Historique 
app.post("/HE/create", (req, res) => {
    delete req.body._id
    let f = new HistoriqueEmail({ ...req.body, date_creation: new Date() })
    f.save()
        .then((FFSaved) => {
            HistoriqueEmail.findById(FFSaved._id).populate('send_to').populate('send_by').then(data => {
                res.status(201).send(data)
            })
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/HE/getAll", (req, res, next) => {
    HistoriqueEmail.find().populate('send_to').populate('send_by')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/HE/getAllTo/:send_to", (req, res, next) => {
    HistoriqueEmail.find({ send_to: req.params.send_to }).populate('send_to').populate('send_by')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/HE/update", (req, res) => {
    HistoriqueEmail.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        HistoriqueEmail.findById(doc._id).populate('send_to').populate('send_by').then(data => {
            res.status(201).send(data)
        })
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/HE/delete/:id', (req, res) => {
    HistoriqueEmail.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.post('/sendPerso', (req, res) => {
    Mail.findById(req.body.send_from).then(email => {
        let transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false, // true for 587, false for other ports
            requireTLS: true,
            auth: {
                user: email.email,
                pass: email.password
            },
        });
        let to = req.body.cc
        let mailOptions = {
            from: email.email,
            to,
            subject: req.body.objet,
            html: req.body.body + '<footer> <img src="signature"/></footer>',
            attachments: [
                {
                    filename: email.signature_file,
                    path: "storage/mail/" + email._id + "/" + email.signature_file,
                    cid: "signature", //same cid value as in the html img src
                },
            ],
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            }
            res.send(mailOptions)
        });
    })
})
module.exports = app;