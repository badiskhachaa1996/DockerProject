const { CV } = require("../models/cv");
const express = require("express");
const fs = require("fs")
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const { Poppler } = require("node-poppler");
var poppler = new Poppler('./usr/bin');
if (!process.argv[2]) {
    poppler = new Poppler();
}
app.post("/create", (req, res) => {
    //Sauvegarde d'un cv
    delete req.body._id
    let cv = new CV(
        {
            ...req.body
        });
    CV.findOne({ user_id: req.body.user_id }).then(cvFound => {
        if (cvFound)
            CV.findByIdAndUpdate(cvFound, { experiences: req.body.experiences, connaissances: req.body.connaissances, langues: req.body.langues }, { new: true }, (err, doc) => {
                if (err) {
                    console.error(err)
                    res.status(400).send(err);
                } else {
                    res.status(201).send({ cv: doc, message: { severity: "success", summary: "Mis à jour du CV", detail: "CV mis à jour" } })
                }
            })
        else
            cv.save()
                .then((cvsaved) => { res.status(201).send({ cv: cvsaved, message: { severity: "success", summary: "Création d'un cv", detail: "CV crée" } }) })
                .catch((error) => {
                    console.error(error)
                    res.status(400).send(error);
                });
    }, (error) => { res.status(500).send(error); })

});

app.get('/getSkills', (req, res) => {
    CV.find({ connaissances: { $ne: null } }).then(cvs => {
        let connaissances = []
        cvs.forEach(cv => {
            cv.connaissances.forEach(c => {
                console.log(c)
                if (connaissances.includes(c.skill.toLowerCase()) == false)
                    connaissances.push(c.skill.toLowerCase())
            })
        });
        res.status(201).send(connaissances)

    }, err => {
        console.error(err, "getSkills")
        res.status(500).send(err)
    })
})

app.get('/getExperiences', (req, res) => {
    CV.find({ experiences: { $ne: null } }).then(cvs => {
        let experiences = []
        cvs.forEach(cv => {
            cv.experiences.forEach(exp => {
                if (experiences.includes(exp.skill.toLowerCase()) == false)
                    experiences.push(exp.skill.toLowerCase())
            })
        });
        res.status(201).send(experiences)
    }, err => {
        console.error(err, "getExp")
        res.status(500).send(err)
    })
})

app.get("/getAll", (req, res) => {
    CV.find().then(cvs => {
        res.status(201).send(cvs)
    }, err => {
        console.error(err)
        res.status(500).send(err)
    })
})
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        if (!fs.existsSync('storage/CV/' + req.body.user_id + '/')) {
            fs.mkdirSync('storage/CV/' + req.body.user_id + '/', { recursive: true })
        }
        callBack(null, 'storage/CV/' + req.body.user_id + '/')
    },
    filename: (req, file, callBack) => {
        callBack(null, "cv.pdf")//`${file.originalname}`
    }
})
const upload = multer({ storage: storage, limits: { fileSize: 1000000 } })
app.post('/uploadCV/:user_id', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        res.status(400).send(error)
    } else {
        var pdf_path = "storage/CV/" + req.body.user_id + "/" + "cv.pdf";
        poppler.pdfToText(pdf_path).then((txt) => {
            res.status(201).send({ txt })
        }, err => {
            console.error(err, "uplaodCV")
            res.status(500).send(err)
        });
    }
}, (error) => { res.status(500).send(error); })

app.get('/getByUserID/:user_id', (req, res) => {
    CV.findOne({ user_id: req.params.user_id }).then(cv => {
        if (cv)
            res.status(201).send(cv)
        else
            res.status(400).send(null)
    }, (error) => { res.status(500).send(error); })
})
module.exports = app;