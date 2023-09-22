const express = require("express");
const app = express();
const { CvType } = require("./../models/CvType");

const multer = require('multer');
const fs = require("fs")
var mime = require('mime-types')
const path = require('path');

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

app.get("/download-cv/:id", uploadCV.single('file'), (req, res, next) => {
    let filePath = path.join('storage', 'cv', req.params.id.toString(), 'cv.pdf')
    let fileExtention = 'pdf';

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

// ajout de CV
app.post("/post-cv", (req, res) => {
    const cv = new CvType({ ...req.body, date_creation: new Date() });

    // requete de securite pour verifier que l'utilisateur n'a pas de CV existant
    CvType.findOne({ user_id: cv.user_id })
        .then((response) => {
            if (response) {
                CvType.findByIdAndUpdate(response._id, { ...req.body, date_creation: new Date() }).then(r => {
                    res.status(200).send(r);
                })

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
    CvType.find()?.populate('user_id').populate({ path: 'competences', populate: { path: "profile_id" } }).populate('createur_id')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/get-cvs-public", (_, res) => {
    CvType.find({ isPublic: { $ne: false } })?.populate('user_id').populate({ path: 'competences', populate: { path: "profile_id" } }).populate('createur_id').sort({ _id: -1 })
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).send(error.message); });
});


// recuperation d'un cv par id du cv
app.get("/get-cv", (req, res) => {
    CvType.findOne({ _id: req.params.id })?.populate('user_id').populate('competences')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error.message); });
});

app.get("/get-object-cv/:id", (req, res) => {
    CvType.findOne({ _id: req.params.id }).populate('user_id').populate({ path: 'competences', populate: { path: "profile_id" } }).populate('createur_id').then((dataCv) => {
        res.status(200).send({ dataCv });
    }).catch((error) => {
        res.status(400).send("erreur :" + error);
    })
});

// recuperation d'un cv par id du user
app.get("/get-cv-by-user_id/:id", (req, res) => {
    CvType.findOne({ user_id: req.params.id })?.populate('user_id').populate({ path: 'competences', populate: { path: "profile_id" } }).populate('createur_id')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error.message); });
});

const uploadLogo = multer({
    storage: multer.diskStorage({
        destination: (req, file, callBack) => {
            if (!fs.existsSync('storage/cvPicture/' + req.body.id + '/')) {
                fs.mkdirSync('storage/cvPicture/' + req.body.id + '/', { recursive: true })
            }
            let filenames = fs.readdirSync('storage/cvPicture/' + req.body.id + '/')
            if (filenames && filenames[0])
                fs.unlinkSync('storage/cvPicture/' + req.body.id + '/' + filenames[0])
            callBack(null, 'storage/cvPicture/' + req.body.id + '/')
        },
        filename: (req, file, callBack) => {
            callBack(null, `${file.originalname}`)
        }
    }), limits: { fileSize: 20000000 }
})

app.post('/uploadPicture', uploadLogo.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        console.error(error)
        res.status(400).send(error)
    } else {
        CvType.findByIdAndUpdate(req.body.id, { picture: req?.file?.originalname }).then(() => {
            res.status(201).json({ message: req?.file?.originalname });
        })

    }
})
app.get('/get-picture-by-user/:id', (req, res) => {
    let id = req.params.id
    let fileOne
    console.log(id)
    let filenames = fs.readdirSync("storage/cvPicture/" + id)
    if (filenames)
        fileOne = {
            file: fs.readFileSync("storage/cvPicture/" + id + "/" + filenames[0], { encoding: 'base64' }, (err) => {
                if (err) return console.error(err);
            }),
            extension: mime.contentType(path.extname("storage/cvPicture/" + id + "/" + filenames[0])),
            url: ""
        }
    res.status(200).send({ fileOne })
})

app.get('/getAllPicture', (req, res) => {
    let ids = fs.readdirSync("storage/cvPicture")
    let fileDic = {}
    ids.forEach(id => {
        console.log(id)
        let filenames = fs.readdirSync("storage/cvPicture/" + id)
        if (filenames)
            fileDic[id] = {
                file: fs.readFileSync("storage/cvPicture/" + id + "/" + filenames[0], { encoding: 'base64' }, (err) => {
                    if (err) return console.error(err);
                }),
                extension: mime.contentType(path.extname("storage/cvPicture/" + id + "/" + filenames[0])),
                url: ""
            }
    })
    res.status(200).send({ files: fileDic, ids })
})


module.exports = app;