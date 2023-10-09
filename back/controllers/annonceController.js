const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Annonce } = require('./../models/Annonce');
const { Matching } = require("./../models/matching");
//Création d'une annonce
app.post("/post-annonce", (req, res) => {
    const annonce = new Annonce({ ...req.body, date_creation: new Date() });

    annonce.save()
        .then((annonceSaved) => { res.status(201).send(annonceSaved); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Recuperation de la liste des annonces
app.get("/get-annonces", (_, res) => {
    Annonce.find()?.populate('entreprise_id')?.populate('profil')?.populate('competences').populate("user_id").sort({ _id: -1 })
        .then((annonces) => { res.status(200).send(annonces); })
        .catch((error) => { res.status(500).send(error.message); });
});


//Récuperation d'une annonce via son identifiant
app.get("/get-annonce/:annonceId", (req, res) => {
    Annonce.findOne({ _id: req.params.annonceId })?.populate('entreprise_id')?.populate('profil')?.populate('competences').sort({ _id: -1 })
        .then((annonce) => { res.status(200).send(annonce); })
        .catch((error) => { res.status(500).send(error.message); });
});

//Récuperation des annonces via un user id
app.get("/get-annonces-by-user-id/:userId", (req, res) => {
    Annonce.find({ user_id: req.params.userId })?.populate('entreprise_id')?.populate('profil')?.populate('competences')
        .then((annonces) => { res.status(200).send(annonces); })
        .catch((error) => { res.status(500).send(error.message); });
});


//Modification d'une annonce
app.put("/put-annonce", (req, res) => {

    Annonce.updateOne({ _id: req.body._id }, { ...req.body })
        .then((annonce) => { res.status(200).send(annonce) })
        .catch((error) => { res.status(500).send(error.message) })
});

app.delete('/delete/:id', (req, res) => {
    Annonce.findByIdAndRemove(req.params.id)
        .then((annonce) => {
            Matching.remove({ offre_id: req.params.id }).then(offres => {
                res.status(200).send({ annonce, offres })
            })

        })
        .catch((error) => { res.status(500).send(error.message) })
})

module.exports = app;