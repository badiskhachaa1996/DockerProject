const express = require("express");
const mongoose = require("mongoose")
const Sujet = mongoose.model('sujet')
const app = express();
app.disable("x-powered-by");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const { pwdToken } = require("../models/pwdToken");
const { Tuteur } = require("../models/Tuteur");
const { User } = require("../models/user");
const nodemailer = require('nodemailer');
const fs = require("fs");
const path = require('path');
const { Entreprise } = require("../models/entreprise")

let origin = ["http://localhost:4200"]
if (process.argv[2]) {
    let argProd = process.argv[2]
    if (argProd.includes("dev")) {
        origin = ["https://141.94.71.25", "https://dev-ims.intedgroup.com"];
    } else if (argProd.includes("qa")) {
        origin = ["https://152.228.219.55", "https://qa-ims.intedgroup.com"];
    } else if (argProd.includes("prod2")) {
        origin = ["https://51.68.215.184", "https://prod2-ims.intedgroup.com"];
    } else (
        origin = ["https://ticket.estya.com", "https://estya.com", "https://adgeducations.com"]
    )
}

app.post("/create", (req, res, next) => {

    //création d'un nvx tuteur + nvx user
    let data = req.body.newTuteur;
    delete data._id;
    let tuteur = new Tuteur(
        {
            ...data
        });

    let userData = req.body.newUser;
    let user = new User({
        ...userData,
        email: userData.email_perso,
        /*password: bcrypt.hashSync(data.password, 8),*/
        role: 'user',
        type: "Tuteur",
        date_creation: new Date()
    });

    user.save()
        .then((userCreated) => {
            tuteur.user_id = userCreated._id;
            tuteur.save()
                .then((tuteurSaved) => {
                    res.status(201).json({ tuteur: tuteurSaved, user: userCreated })
                })
                .catch((error) => {
                    res.status(400).json({ msg: "Impossible d'ajouter ce tuteur ", error })
                });
        })
})

//tuteur update
app.post("/updateById/:id", (req, res, next) => {
    //création d'un tuteur
    let data = req.body.newTuteur;
    Tuteur.findOneAndUpdate({ _id: req.params.id },
        {
            ...req.body
        }, (err, tuteurUpdated) => {
            if (err) {
                console.error(err)
                res.send(err)
            }
            else {
                res.send(tuteurUpdated)
            }
        });
});

//Recuperation de tous les tuteur selon l'id d'une entreprise
app.get('/getAllByEntrepriseId/:entrepriseId', (req, res, next) => {
    Tuteur.find({ entreprise_id: req.params.entrepriseId }).populate('user_id')
        .then((TuteurFromdb) => { res.status(200).send(TuteurFromdb) })
        .catch(error => {
            console.error(error)
            res.status(400).send(error)
        });

});

//Recuperation de tous les tuteur selon l'id d'une entreprise
app.get('/getByEntrepriseId/:entrepriseId', (req, res, next) => {
    Tuteur.findOne({ entreprise_id: req.params.entrepriseId }).populate('user_id')
        .then((TuteurFromdb) => { res.status(200).send(TuteurFromdb) })
        .catch(error => {
            console.error(error)
            res.status(400).send(error)
        });

});

//Recuperation des données d'un tuteur
app.get('/getById/:id', (req, res, next) => {
    Tuteur.findOne({ _id: req.params.id }).populate('user_id')
        .then((TuteurFromdb) => res.status(200).send(TuteurFromdb))
        .catch(error => {
            console.error(error)
            res.status(400).send(error)
        });
});

//Recuperation liste de tuteurs

app.get("/getAll", (req, res, next) => {
    Tuteur.find().populate('user_id')
        .then((TuteurFromdb) => { res.status(200).send(TuteurFromdb) })
        .catch((error) => { res.status(500).json({ error: "Impossible de recuperer la liste des tuteurs " + error.Message }) })
});

//recupération d'un tuteur via l'user id
app.get('/getByUserId/:id', (req, res, next) => {
    Tuteur.findOne({ user_id: req.params.id })
        .then((data) => res.status(200).send(data))
        .catch(error => {
            console.error(error)
            res.status(400).send(error)
        });
});


//recupération d'un tuteur via l'user id
app.get('/getPopulatebyUserID/:id', (req, res, next) => {
    Tuteur.findOne({ user_id: req.params.id }).populate('user_id').populate('entreprise_id')
        .then((data) => res.status(200).send(data))
        .catch(error => {
            console.error(error)
            res.status(400).send(error)
        });
});
module.exports = app;