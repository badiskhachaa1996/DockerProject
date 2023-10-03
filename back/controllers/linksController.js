const express = require("express");
const app = express();
const {Links} = require("../models/links");
//CREATION LIEN 
app.post("/create-links", (req, res) => {
    console.log("**********************************************")
    const links = new Links({ ...req.body });

    links.save()
    .then((linksCreated) => { res.status(201).json({ links: linksCreated, success: 'links crée' }) })
    .catch((error) => { console.error(error); res.status(500).json({ error: 'Impossible de créer le link, si le problème persite veuillez créer un ticket au service IMS' }); })
});
app.get('/get-project/:id', (req, res, next) => {
    Project.findOne({ _id: req.params.id })?.populate('creator_id')
    .then((project) => { res.status(200).send(project); })
    .catch((error) => { console.error(error); res.status(400).json({ error: 'Impossible de récuperer le projet'}); })
});
module.exports = app;