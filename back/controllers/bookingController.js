const express = require('express');
const app = express();
app.disable("x-powered-by");
const { SujetBooking} = require('../models/SujetBooking');


// Création d'un nouveau sujet
app.post("/create", (req, res, next) => {
  const sujet = new SujetBooking({ ...req.body});

  sujet.save()
  .then((sujetCreated) => { res.status(201).json({ sujet: sujetCreated, success: 'Sujet crée' }) })
  .catch((error) => { console.log(error); res.status(500).json({ error: 'Impossible de créer le sujet, si le problème persite veuillez créer un ticket au service IMS',}); })
});


// Mettre à jour un sujet
app.put("/update-sujet-booking", (req, res) => {
  const sujet = new SujetBooking({ ...req.body });

  SujetBooking.updateOne({ _id: sujet._id }, { ...req.body })
    .then((sujet) => { res.status(201).json({ sujet: sujet, success: 'Sujejt mis à jour'}); })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de mettre à jour le sujet, si le problème persite veuillez créer un ticket au service IMS' }); });
});

// Suppresion d'un sujet 
app.delete("/delete-sujet-booking/:id", (req, res, next) => {
  SujetBooking.deleteOne({ _id: req.params.id })
  .then((response) => { res.status(200).json({ success: "Sujet supprimé" }) })
  .catch((error) => {console.log(error); res.status(400).json({ error: "Impossible de supprimer ce sujet" });})
})

// get all sujets
app.get('/get-sujets', (req, res, next) => {
  SujetBooking.find().populate("membre")
  .then((sujetsBooking) => { res.status(200).send(sujetsBooking) })
  .catch((error) => { console.log(error); res.status(500).json({ error: 'Impossible de récuperer les sujets' }); })
  
})

//Désactiver un sujet
app.get("/hide-sujet-booking/:id", (req, res) => {
  SujetBooking.findByIdAndUpdate(req.params.id,
      { active: false }, { new: true }, (err, sujet) => {
          if (err) {
              res.send(err)
          }
          else {
              res.send(sujet)
          }
      })
});

//Activer un sujet
app.get("/show-sujet-booking/:id", (req, res) => {
  SujetBooking.findByIdAndUpdate(req.params.id,
      { active: true }, { new: true }, (err, sujet) => {
          if (err) {
              res.send(err)
          }
          else {
              res.send(sujet)
          }
      })
});

module.exports = app;

