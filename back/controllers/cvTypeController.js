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
        let storage = `storage/cv/${id}/`;

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

    res.status(200).send({ r: 'success' });
});

app.get("/download-cv/:id", uploadCV.single('file'), (req, res, next) => {
    let filePath = path.join('storage', 'cv', req.params.id.toString(), 'cv.pdf')

    try {
        let file = fs.readFileSync(filePath, { encoding: 'base64' }, (error) => {
            if (error) {
                res.status(400).json({ error: error });
            }
        });

        res.status(200).json({ file: file, extension: 'application/pdf' });
    } catch (e) {
        res.status(400).json({ error: e })
    }
});

// ajout de CV
app.post("/post-cv", (req, res) => {
    const cv = new CvType({ ...req.body, date_creation: new Date() });

    // requete de securite pour verifier que l'utilisateur n'a pas de CV existant
    CvType.findOne({ user_id: cv.user_id })
        .then((response) => {
            if (response) {
                CvType.findByIdAndUpdate(response._id, { ...req.body, date_creation: new Date(), last_modified_at: new Date() }).then(r => {
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
    CvType.findByIdAndUpdate(req.body._id, { ...req.body, last_modified_at: new Date() }, { new: true })
        .then((reponse) => { res.status(201).send(reponse); })
        .catch((error) => { res.status(400).send(error.message); });
});


// recuperation de la liste de cv
app.get("/get-cvs", (_, res) => {
    CvType.find({ user_id: { $ne: null } })?.populate('user_id').populate({ path: 'competences', populate: { path: "profile_id" } }).populate('createur_id').populate('profil').populate('winner_id')
        .then((response) => {
            let r = []
            response.forEach(cv => {
                if (cv.competences && cv.competences.length >= 3)
                    cv.taux += 37.5
                else if (cv.competences && cv.competences.length >= 1)
                    cv.taux += 22.5
                if (cv.experiences_pro && cv.experiences_pro.length != 0)
                    cv.taux += 15
                if (cv.education && cv.education.length != 0)
                    cv.taux += 15
                if (cv.langues && cv.langues.length != 0)
                    cv.taux += 7.5
                if (cv.centre_interets && cv.centre_interets.length != 0)
                    cv.taux += 7.5
                if (cv.experiences_associatif && cv.experiences_associatif.length != 0)
                    cv.taux += 7.5
                //RESTE = 10%
                if (cv.mobilite_lieu && cv.mobilite_lieu.length != 0)
                    cv.taux += 2
                if (cv.a_propos && cv.a_propos != '')
                    cv.taux += 2
                if (cv.disponibilite && new Date(cv.disponibilite).getTime() != new Date().getTime())
                    cv.taux += 2
                if (cv.informatique && cv.informatique.length != 0)
                    cv.taux += 2
                if (cv.niveau_etude && cv.niveau_etude != '')
                    cv.taux += 2
                if (cv.user_id)
                    r.push(cv)
            })
            res.status(200).send(r);
        })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/get-cvs-public", (_, res) => {
    CvType.find({ user_id: { $ne: null }, isPublic: { $ne: false } })?.populate('user_id').populate({ path: 'competences', populate: { path: "profile_id" } }).populate('createur_id').sort({ _id: -1 })
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).send(error.message); });
});


// recuperation d'un cv par id du cv
app.get("/get-cv/:id", (req, res) => {
    CvType.findOne({ _id: req.params.id })?.populate('user_id').populate({ path: 'competences', populate: { path: "profile_id" } }).populate('createur_id').populate('profil')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error.message); });
});

app.delete("/delete-cv/:id", (req, res) => {
    CvType.findByIdAndRemove(req.params.id)
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error.message); });
});

app.get("/get-object-cv/:id", (req, res) => {
    CvType.findOne({ _id: req.params.id }).populate('user_id').populate({ path: 'competences', populate: { path: "profile_id" } }).populate('createur_id').populate('profil').then((dataCv) => {
        res.status(200).send({ dataCv });
    }).catch((error) => {
        res.status(400).send("erreur :" + error);
    })
});

// recuperation d'un cv par id du user
app.get("/get-cv-by-user_id/:id", (req, res) => {
    CvType.findOne({ user_id: req.params.id }).populate('user_id').populate({ path: 'competences', populate: { path: "profile_id" } }).populate('createur_id').populate('profil')
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
    let ids = fs.readdirSync("storage/profile/")
    let fileDic = {}
    ids.forEach(id => {
        try {
            let filenames = fs.readdirSync("storage/profile/" + id)
            if (filenames)
                fileDic[id] = {
                    file: fs.readFileSync("storage/profile/" + id + "/" + filenames[0], { encoding: 'base64' }, (err) => {
                        if (err) return console.error(err);
                    }),
                    extension: mime.contentType(path.extname("storage/profile/" + id + "/" + filenames[0])),
                    url: ""
                }
        } catch (error) {

        }
    })
    res.status(200).send({ files: fileDic, ids })
})

app.get('/getAllToday', (req, res) => {
    let day = new Date().getDate().toString()
    let month = (new Date().getMonth() + 1).toString()
    let year = new Date().getFullYear().toString()
    console.log(`${year}-${month}-${day}`)
    CvType.find({ date_creation: { $gte: `${year}-${month}-${day}`, $lte: `${year}-${month}-${day} 23:59` } }).populate('createur_id').then(val => {
        res.send(val)
    })
})

app.get('/getAllByDate/:date1/:date2', (req, res) => {
    CvType.find({ date_creation: { $gte: req.params.date1, $lte: req.params.date2 } }).sort({ date_creation: 1 }).populate('createur_id').then(val => {
        res.send(val)
    })
})


module.exports = app;