const express = require("express");
const { Brand } = require("../models/brand");
const { SupportMarketing } = require("../models/supportMarketing");
const app = express(); //à travers ça je peux faire la creation des services
const fs = require("fs")
var mime = require('mime-types')
const path = require('path');
app.disable("x-powered-by");

app.post("/B/create", (req, res) => {
    delete req.body._id
    let f = new Brand({ ...req.body })
    f.save()
        .then((FFSaved) => {
            Brand.findById(FFSaved._id).populate('partenaire_id')
                .then((formFromDb) => { res.status(200).send(formFromDb); })
                .catch((error) => { console.error(error); res.status(500).send(error); });
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/B/getByID/:id", (req, res) => {
    Brand.findById(req.params.id).populate('partenaire_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/B/getByPartenaireID/:id", (req, res) => {
    Brand.find({ partenaire_id: req.params.id }).populate('partenaire_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/B/getAll", (req, res, next) => {
    Brand.find().populate('partenaire_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/B/update", (req, res) => {
    Brand.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }).then(doc => {
        Brand.findById(req.body._id).populate('partenaire_id')
            .then((formFromDb) => { res.status(200).send(formFromDb); })
            .catch((error) => { console.error(error); res.status(500).send(error); });
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete("/B/delete/:id", (req, res) => {
    Brand.findByIdAndDelete(req.params.id)
        .then((formFromDb) => {
            res.status(200).send(formFromDb);
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})


app.post("/SM/create", (req, res) => {
    delete req.body._id
    let f = new SupportMarketing({ ...req.body })
    f.save()
        .then((FFSaved) => {
            SupportMarketing.findById(FFSaved._id).populate('brand_id')
                .then((formFromDb) => { res.status(200).send(formFromDb); })
                .catch((error) => { console.error(error); res.status(500).send(error); });
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})
app.put("/SM/update", (req, res) => {
    SupportMarketing.findByIdAndUpdate(req.body._id, { ...req.body }, (err, doc) => {
        SupportMarketing.findById(doc._id).populate('brand_id')
            .then((formFromDb) => { res.status(200).send(formFromDb); })
            .catch((error) => { console.error(error); res.status(500).send(error); });
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/SM/getAll", (req, res, next) => {
    SupportMarketing.find().populate('brand_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/SM/getAllByBrand/:id", (req, res, next) => {
    SupportMarketing.find({ brand_id: req.params.id }).populate('brand_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/SM/getByID/:id", (req, res) => {
    SupportMarketing.findById(req.params.id).populate('brand_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete("/SM/delete/:id", (req, res) => {
    SupportMarketing.findByIdAndDelete(req.params.id)
        .then((formFromDb) => {
            res.status(200).send(formFromDb);
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callBack) => {
            if (!fs.existsSync('storage/supportMarketing/' + req.body.id + '/')) {
                fs.mkdirSync('storage/supportMarketing/' + req.body.id + '/', { recursive: true })
            }
            let filenames = fs.readdirSync('storage/supportMarketing/' + req.body.id + '/')
            if (filenames && filenames[0])
                fs.unlinkSync('storage/supportMarketing/' + req.body.id + '/' + filenames[0])
            callBack(null, 'storage/supportMarketing/' + req.body.id + '/')
        },
        filename: (req, file, callBack) => {
            callBack(null, `${file.originalname}`)
        }
    }), limits: { fileSize: 20000000 }
})

app.post('/SM/upload', upload.single('file'), (req, res, next) => {

    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        res.status(400).send(error)
    } else {
        SupportMarketing.findByIdAndUpdate(req.body.id, { haveFile: true }, { new: true }, (err, doc) => {
            res.status(201).send(doc);
        })

    }

}, (error) => { res.status(500).send(error); })

const uploadLogo = multer({
    storage: multer.diskStorage({
        destination: (req, file, callBack) => {
            if (!fs.existsSync('storage/logoBrand/' + req.body.id + '/')) {
                fs.mkdirSync('storage/logoBrand/' + req.body.id + '/', { recursive: true })
            }
            let filenames = fs.readdirSync('storage/logoBrand/' + req.body.id + '/')
            if (filenames && filenames[0])
                fs.unlinkSync('storage/logoBrand/' + req.body.id + '/' + filenames[0])
            callBack(null, 'storage/logoBrand/' + req.body.id + '/')
        },
        filename: (req, file, callBack) => {
            callBack(null, `${file.originalname}`)
        }
    }), limits: { fileSize: 20000000 }
})

app.post('/B/uploadLogo', uploadLogo.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        console.error(error)
        res.status(400).send(error)
    } else {
        res.status(201).json({ message: "dossier mise à jour" });
    }
})

app.get("/B/downloadLogo/:id", (req, res) => {
    let pathFile = "storage/logoBrand/" + req.params.id
    let filenames = fs.readdirSync(pathFile)
    let file = fs.readFileSync(pathFile + "/" + filenames[0], { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    res.status(200).send({ file: file, documentType: mime.contentType(path.extname(pathFile)) })
});

app.get('/B/getAllLogo', (req, res) => {
    let ids = fs.readdirSync("storage/logoBrand")
    let fileDic = {}
    ids.forEach(id => {
        let filenames = fs.readdirSync("storage/logoBrand/" + id)
        if (filenames)
            fileDic[id] = {
                file: fs.readFileSync("storage/logoBrand/" + id + "/" + filenames[0], { encoding: 'base64' }, (err) => {
                    if (err) return console.error(err);
                }),
                extension: mime.contentType(path.extname("storage/logoBrand/" + id + "/" + filenames[0])),
                url: ""
            }
    })
    res.status(200).send({ files: fileDic, ids })
})

app.get("/SM/download/:id", (req, res) => {
    let pathFile = "storage/supportMarketing/" + req.params.id

    let filenames
    try {
        filenames = fs.readdirSync(pathFile)
    } catch (error) {
        res.status(404).send({ message: "File not found" })
    }
    if (filenames) {
        let file = fs.readFileSync(pathFile + "/" + filenames[0], { encoding: 'base64' }, (err) => {
            if (err) {
                return console.error(err);
            }
        });
        res.status(200).send({ file: file, documentType: mime.contentType(path.extname(pathFile + "/" + filenames[0])) })
    }


});


module.exports = app;