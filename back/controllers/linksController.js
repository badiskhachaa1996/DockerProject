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

//recuperation des links

app.get("/getalllinks", (req, res) => {
    Links.find()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("impossible de récupérer les links");
    })});


app.get('/get-links/:id', (req, res, next) => {
    Links.find({ user_id: req.params.id })
    .then((links) => { res.status(200).send(links); })
    .catch((error) => { console.error(error); res.status(400).json({ error: 'Impossible de récuperer le lien'}); })
});
app.put("/put-links", (req, res, next) => {
    const links = new Links({ ...req.body });

    Links.updateOne({ _id: links._id }, { ...req.body })
    .then((links) => { res.status(201).json({ links: links, success: 'Links mis à jour'}); })
    .catch((error) => { console.error(error); res.status(400).json({ error: 'Impossible de mettre à jour le links, si le problème persite veuillez créer un ticket au service IMS' }); });
});

app.delete("/delete/:id", (req, res, next) => {
  Links.deleteOne({ _id: req.params.id })
  .then((response) => { res.status(200).json({ success: 'liks supprimé' }) })
  .catch((error) => {console.error(error); res.status(400).json({ error: 'Impossible de supprimer ce lien' });})
});
module.exports = app;