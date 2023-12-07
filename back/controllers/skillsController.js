const express = require("express");
const app = express(); //à travers ça je peux faire la creation des Sujets
const { Profile } = require("../models/Profile");
const { Competence } = require("./../models/Competence");
app.disable("x-powered-by");


/* Profile */

// création d'un nouveau profile
app.post("/post-profile", (req, res) => {
    const profile = new Profile({ ...req.body });

    profile.save()
        .then((profileSaved) => { res.status(201).send(profileSaved); })
        .catch((error) => { res.status(500).send(error.message) });
});

// modification d'un profile
app.put("/put-profile", (req, res) => {
    Profile.updateOne({ _id: req.body._id }, { ...req.body })
        .then((profileUpdated) => { res.status(201).send(profileUpdated); })
        .catch((error) => { res.status(500).send(error.message); })
});

// recuperation de tous les profiles
app.get("/get-profiles", (req, res) => {
    Profile.find()
        .then((profiles) => { res.status(200).send(profiles); })
        .catch((error) => { res.status(400).send(error.message); })
});

// recuperation d'un profile via son id profile
app.get("/get-profile/:id", (req, res) => {
    Profile.findOne({ _id: req.params.id })
        .then((profile) => { res.status(200).send(profile); })
        .catch((error) => { res.status(400).send(error.message); })
});


/* Compétence */
// ajout d'une nouvelle comptétence
app.post("/post-competence", (req, res) => {
    const competence = new Competence({ ...req.body });

    competence.save()
        .then((competenceSaved) => { res.status(201).send(competenceSaved); })
        .catch((error) => { res.status(500).send(error.message) });
});

// modification d'une competence
app.put("/put-competence", (req, res) => {
    Competence.updateOne({ _id: req.body._id }, { ...req.body })
        .then((competenceUpdated) => { res.status(201).send(competenceUpdated); })
        .catch((error) => { res.status(500).send(error.message) });
});

// recuperation de la liste des competences
app.get("/get-competences", (req, res) => {
    Competence.find().populate('profile_id')
        .then((competences) => { res.status(200).send(competences); })
        .catch((error) => { res.status(500).send(error.message) });
});

app.delete("/delete/:id", (req, res) => {
    Competence.findByIdAndRemove(req.params.id)
        .then((competences) => { res.status(200).send(competences); })
        .catch((error) => { res.status(500).send(error.message) });
});

// recuperation d'une competence via son id
app.get("/get-competence/:id", (req, res) => {
    Competence.findOne({ _id: req.params.id })
        .then((competence) => { res.status(200).send(competence); })
        .catch((error) => { res.status(500).send(error.message) });
});

// recuperation de la liste des competence d'un profil
app.get("/get-competence-by-profile/:id", (req, res) => {
    Competence.find({ profile_id: req.params.id })?.populate('profile_id')
        .then((competence) => { res.status(200).send(competence); })
        .catch((error) => { res.status(500).send(error.message) });
});

module.exports = app;