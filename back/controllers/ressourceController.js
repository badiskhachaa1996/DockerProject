const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Ressource } = require("./../models/ressource");
const { Classe } = require("./../models/classe");
const fs = require("fs");

app.post("/create", (req, res) => {
    //Ajouter une ressource
    let data = req.body;
    let ressource = new Ressource({
        edt: data.edt,
        program: data.programme,
        calendar: data.calendar,
    });
    console.log(data)
    ressource.save().then((ressourceFromDB) => {
        res.status(200).send(ressourceFromDB);
    }).catch((error) => {
        res.status(404).send(error);
    });
});

app.post("/editById/:id", (req, res) => {
    //Modifier une ressource
    Ressource.findOneAndUpdate(req.params.id, {
        edt: req.body.edt,
        program: req.body.program,
        calendar: req.body.calendar,
    }, { new: true }, (err, ressource) => {
        if (err) {
            res.send(err)
        }
        else {
            res.send(ressource)
        }
    });
});

app.get("/getById/:id,", (req, res) => {
    //Récupérer une ressource
    Ressource.findOne({ _id: req.params.id }).then((dataRessoruce) => {
        res.status(200).send({ dataRessoruce });
    }).catch((error) => {
        res.status(400).send("erreur :" + error);
    })
});

app.post("/sendRessource/:id/:nom", (req, res) => {
    //Sauvegarde du fichier si il existe
    if (req.body.file && req.body.file != null && req.body.file != '') {
        fs.mkdir("./storage/" + req.body.classe_id + "/",
            { recursive: true }, (err) => {
                if (err) {
                    console.error(err);
                }
            }
        )
    }
    fs.writeFile("/storage/" + req.body.classe_id + "/" + req.params.nom + req.body.file.filename, req.body.file.value, 'base64', function (err) {
        if (err) {
            console.error(err);
        }
    });
});

app.get("/getEDT/:id", (req, res) => {
    //Récupérer l'emploi du temps par classe
    Ressource.findOne({ _id: req.params.id }).then((data) => {
        let filename = data.edt
        let file = fs.readFileSync("storage/" + data.classe_id + "/" + filename, { encoding: 'base64' }, (err) => {
            if (err) {
                return console.error(err);
            }
        });
        res.status(200).send({ file: file, documentType: data.edtType })
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});

app.get("/getProgram/:id", (req, res) => {
    //Récupérer le programme par classe
    Ressource.findOne({ _id: req.params.id }).then((data) => {
        let filename = data.edt
        let file = fs.readFileSync("storage/" + data.classe_id + "/" + filename, { encoding: 'base64' }, (err) => {
            if (err) {
                return console.error(err);
            }
        });
        res.status(200).send({ file: file, documentType: data.edtType })
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});

module.exports = app;