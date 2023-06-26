const express = require("express");
const bcrypt = require("bcryptjs");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const nodemailer = require('nodemailer');
var mime = require('mime-types')
const path = require('path');
const { EmailType } = require("../models/emailType");
const fs = require("fs");
const multer = require("multer");

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new EmailType({ ...req.body, password: bcrypt.hashSync(req.body.password, 8) })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/getAll", (req, res, next) => {
    EmailType.find().sort({ date_creation: -1 })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/update", (req, res) => {
    EmailType.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.status(200).send(doc);
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    EmailType.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get('/getAllSignature', (req, res) => {
    let ids = fs.readdirSync("storage/emailType")
    let fileDic = {}
    ids.forEach(id => {
        let filenames = fs.readdirSync("storage/emailType/" + id)
        if (filenames)
            fileDic[id] = {
                file: fs.readFileSync("storage/emailType/" + id + "/" + filenames[0], { encoding: 'base64' }, (err) => {
                    if (err) return console.error(err);
                }),
                extension: mime.contentType(path.extname("storage/emailType/" + id + "/" + filenames[0])),
                url: ""
            }
    })
    res.status(200).send({ files: fileDic, ids })
})

//Sauvegarde de la photo de profile
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let id = req.body.id;
        if (!fs.existsSync("storage/emailType/" + id + "/")) {
            fs.mkdirSync("storage/emailType/" + id + "/", { recursive: true });
        }
        callBack(null, "storage/emailType/" + id + "/");
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
    EmailType.findById(req.body.id, (err, email) => {
        try {
            if (
                fs.existsSync(
                    "storage/emailType/" + req.body.id + "/" + email.signature_file
                )
            )
                fs.unlinkSync(
                    "storage/emailType/" + req.body.id + "/" + email.signature_file
                );
            //file removed
        } catch (err2) {
            console.log("Un fichier n'existait pas avant");
            if (err2)
                console.error(err2);
        }
    });

    EmailType.findOneAndUpdate(
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
module.exports = app;