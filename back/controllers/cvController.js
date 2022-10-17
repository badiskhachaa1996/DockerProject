const { CV } = require("../models/cv");
const express = require("express");
const fs = require("fs")
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const { Poppler } = require("node-poppler");
const poppler = new Poppler();

app.post("/create", (req, res) => {
    //Sauvegarde d'un cv
    delete req.body._id
    let cv = new CV(
        {
            ...req.body
        });

    cv.save()
        .then((cvsaved) => { res.status(201).send(cvsaved) })
        .catch((error) => {
            console.error(error)
            res.status(400).send(error);
        });
});

app.get('/getSkills', (req, res) => {
    CV.find({ connaissances: { $ne: null } }, (cvs => {
        let connaissances = []
        cvs.forEach(cv => {
            cv.connaissances.keys().forEach(c => {
                if (connaissances.includes(c) == false)
                    connaissances.push(c)
            })
        });
        res.status(201).send(connaissances)
    }, err => {
        console.error(err)
        res.status(500).send(err)
    }))
})

app.get('/getExperiences', (req, res) => {
    CV.find({ experiences: { $ne: null } }, (cvs => {
        let experiences = []
        cvs.forEach(cv => {
            cv.experiences.keys().forEach(exp => {
                if (experiences.includes(exp) == false)
                    experiences.push(exp)
            })
        });
        res.status(201).send(experiences)
    }, err => {
        console.error(err)
        res.status(500).send(err)
    }))
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
            console.log(txt);
            res.status(201).send({ txt })
        }, err => {
            console.error(err)
            res.status(500).send(err)
        });
    }
}, (error) => { res.status(500).send(error); })
module.exports = app;