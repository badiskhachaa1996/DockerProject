const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const multer = require('multer');
const fs = require("fs")
var mime = require('mime-types')
const path = require('path');
const { TeamsInt } = require("../models/teamsInt");
const { MemberInt } = require("../models/memberInt");
const { User } = require("../models/user");
const { AlternantsPartenaire } = require("../models/alternantsPartenaire");
const { CommercialPartenaire } = require("../models/CommercialPartenaire");
const { Partenaire } = require("./../models/partenaire");

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new AlternantsPartenaire({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/getByID/:id", (req, res) => {
    AlternantsPartenaire.findById(req.params.id)
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})


app.get("/getAll", (req, res, next) => {
    AlternantsPartenaire.find()
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/getAllByCommercialUserID/:id", (req, res, next) => {
    /*AlternantsPartenaire.find()
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });*/
    CommercialPartenaire.findOne({ user_id: req.params.id }).populate('partenaire_id').then(commercial => {
        if (commercial && commercial.statut == 'Admin')
            if (commercial.partenaire_id)
                AlternantsPartenaire.find({ code_commercial: { $regex: "^" + commercial.partenaire_id.code_partenaire } }).populate("user_id").populate('agent_id')
                    .then((prospectsFromDb) => {
                        res.status(201).send(prospectsFromDb)
                    })
                    .catch((error) => { res.status(500).send(error.message); });
            else {
                let code = commercial.code_commercial_partenaire.substring(0, -3)
                AlternantsPartenaire.find({ code_commercial: { $regex: "^" + code } }).populate("user_id").populate('agent_id')
                    .then((prospectsFromDb) => {
                        res.status(201).send(prospectsFromDb)
                    })
                    .catch((error) => { res.status(500).send(error.message); });
            }
        else if (commercial)
            AlternantsPartenaire.find({ code_commercial: commercial.code_commercial_partenaire }).populate("user_id").populate('agent_id')
                .then((prospectsFromDb) => {
                    res.status(201).send(prospectsFromDb)
                })
                .catch((error) => { res.status(500).send(error.message); });
        else
            res.status(500).send("Commercial non trouvé")

    })
});

app.get('/getAllByPartenaireID/:id', (req, res) => {
    Partenaire.findById(req.params.id).then(partenaire => {
        AlternantsPartenaire.find({ code_commercial: { $regex: "^" + partenaire.code_partenaire } }).populate("user_id").populate('agent_id')
            .then((prospectsFromDb) => {
                res.status(201).send(prospectsFromDb)
            })
            .catch((error) => { res.status(500).send(error.message); });
    })
})

app.get('/getAllByCommercialCode/:code', (req, res) => {
    AlternantsPartenaire.find({ code_commercial: req.params.code }).populate("user_id").populate('agent_id')
        .then((prospectsFromDb) => {
            res.status(201).send(prospectsFromDb)
        })
        .catch((error) => { res.status(500).send(error.message); });
})

app.put("/update", (req, res) => {
    AlternantsPartenaire.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

const uploadAdmin = multer({
    storage: multer.diskStorage({
        destination: (req, file, callBack) => {
            if (!fs.existsSync('storage/alternantsPartenaire/requis/' + req.body.id + '/')) {
                fs.mkdirSync('storage/alternantsPartenaire/requis/' + req.body.id + '/', { recursive: true })
            }
            callBack(null, 'storage/alternantsPartenaire/requis/' + req.body.id + '/')
        },
        filename: (req, file, callBack) => {
            callBack(null, `${file.originalname}`)
        }
    }), limits: { fileSize: 20000000 }
})

app.post('/uploadRequisFile', uploadAdmin.single('file'), (req, res, next) => {

    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        res.status(400).send(error)
    } else {
        AlternantsPartenaire.findById(req.body.id, ((err, alternant) => {
            let document_req = alternant.documents_requis
            document_req.forEach((element, index) => {
                if (element.nom == req.body.nom)
                    document_req[index].path = req.body.path
            });
            AlternantsPartenaire.findByIdAndUpdate(req.body.id, { documents_requis: document_req }, { new: true }, (err, doc) => {
                res.status(201).json({ dossier: "dossier mise à jour", documents_requis: doc.documents_requis });
            })
        }))

    }

}, (error) => { res.status(500).send(error); })

const uploadOptionnel = multer({
    storage: multer.diskStorage({
        destination: (req, file, callBack) => {
            if (!fs.existsSync('storage/alternantsPartenaire/optionnel/' + req.body.id + '/')) {
                fs.mkdirSync('storage/alternantsPartenaire/optionnel/' + req.body.id + '/', { recursive: true })
            }
            callBack(null, 'storage/alternantsPartenaire/optionnel/' + req.body.id + '/')
        },
        filename: (req, file, callBack) => {
            callBack(null, `${file.originalname}`)
        }
    }), limits: { fileSize: 20000000 }
})

app.post('/uploadOptionnelFile', uploadOptionnel.single('file'), (req, res, next) => {

    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        res.status(400).send(error)
    } else {
        AlternantsPartenaire.findById(req.body.id, ((err, alternant) => {
            alternant.documents_optionnel.push({ path: req.body.path, nom: req.body.nom })
            AlternantsPartenaire.findByIdAndUpdate(req.body.id, { documents_optionnel: alternant.documents_optionnel }, { new: true }, (err, doc) => {
                res.status(201).json({ dossier: "dossier mise à jour", documents_optionnel: alternant.documents_optionnel });
            })
        }))

    }

}, (error) => { res.status(500).send(error); })

app.get("/downloadFile/:id/:directory/:path", (req, res) => {
    if (!fs.existsSync("storage/alternantsPartenaire/" + req.params.directory + "/" + req.params.id + "/"))
        fs.mkdirSync("storage/alternantsPartenaire/" + req.params.directory + "/" + req.params.id + "/", { recursive: true });
    let pathFile = "storage/alternantsPartenaire/" + req.params.directory + "/" + req.params.id + "/" + req.params.path
    let file = fs.readFileSync(pathFile, { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    res.status(200).send({ file: file, documentType: mime.contentType(path.extname(pathFile)) })

});


app.get("/deleteOptioFile/:id/:path", (req, res) => {
    if (!fs.existsSync("storage/alternantsPartenaire/optionnel/" + req.params.id + "/"))
        fs.mkdirSync("storage/alternantsPartenaire/optionnel/" + req.params.id + "/", { recursive: true });
    let pathFile = "storage/alternantsPartenaire/optionnel/" + req.params.id + "/" + req.params.path
    try {
        fs.unlinkSync(pathFile)
    } catch (err) {
        console.error(err)
        res.status(400).send(err)
    }
    AlternantsPartenaire.findById(req.body.id, ((err, alternant) => {
        let documents_optio = alternant.documents_optionnel
        documents_optio.forEach((element, index) => {
            if (element.path == req.params.path)
                documents_optio.splice(index, 1)
        });
        AlternantsPartenaire.findByIdAndUpdate(req.body.id, { documents_optionnel: documents_optio }, { new: true }, (err, doc) => {
            res.status(201).json({ dossier: "dossier mise à jour", documents_optionnel: doc.documents_optionnel });
        })
    }))
    res.status(200).send()
});

app.get("/deleteRequisFile/:id/:path", (req, res) => {
    if (!fs.existsSync("storage/alternantsPartenaire/requis/" + req.params.id + "/"))
        fs.mkdirSync("storage/alternantsPartenaire/requis/" + req.params.id + "/", { recursive: true });
    let pathFile = "storage/alternantsPartenaire/requis/" + req.params.id + "/" + req.params.path
    try {
        fs.unlinkSync(pathFile)
    } catch (err) {
        console.error(err)
        res.status(400).send(err)
    }
    AlternantsPartenaire.findById(req.body.id, ((err, alternant) => {
        let document_req = alternant.documents_requis
        document_req.forEach((element, index) => {
            if (element.path == req.params.path)
                document_req[index].path = null
        });
        AlternantsPartenaire.findByIdAndUpdate(req.body.id, { documents_requis: document_req }, { new: true }, (err, doc) => {
            res.status(201).json({ dossier: "dossier mise à jour", documents_requis: doc.documents_requis });
        })
    }))
    res.status(200).send()
});

module.exports = app;