const express = require("express");
const app = express();
app.disable("x-powered-by");
//importation du modele de données Reservation
const { Reservation } = require('./../models/Reservation');


//Methode de création d'une nouvelle réservation
app.post("/newReservation", (req, res, next) => {
    //suppression de l'id venant du model Article du front
    delete req.body._id;

    const reservation = new Reservation({ ...req.body });

    //Verification si la reservation n'existe pas au nom du même utilisateur
    Reservation.findOne({ pwR: reservation.pwR })
               .then((reservationFromDb) => {
                    if(reservationFromDb)
                    {
                        res.status(200).json({ error: 'Vous avez déjà une réservation en cours'});
                    }
                    else
                    {
                        reservation.save()
                                .then((reservationSaved) => {
                                    res.status(201).json({ success: 'Votre réservation à bien été enregistré'})
                                })
                                .catch((error) => { res.status(400).json({ error: "Impossible d'effectuer une nouvelle réservation"}) })
                    }
               })
               .catch((error) => { res.status(500).json({error: "Impossible de verifier l'existence de la réservation"}) })
});


//Recuperation de toute les réservations existantes
app.get("/getAllReservation", (req, res) => {
    Reservation.find()
           .then((reservationsFromDb) => { res.status(200).send(reservationsFromDb)})
           .catch((error) => { res.status(500).send('Impossible de recuperer les réservations')})
});

//Recuperation de toute les réservations existantes et validées
app.get("/getAllReservationsValidated", (req, res) => {
    Reservation.find({ isValidate: true })
           .then((reservationsFromDb) => { res.status(200).send(reservationsFromDb)})
           .catch((error) => { res.status(500).send('Impossible de recuperer les réservations')})
});


//methode de validation d'une reservation
app.put("/validateReservation/:id", (req, res) => {
    Reservation.findOneAndUpdate({ _id: req.params.id }, 
                { 
                    ...req.body
                })
               .then(() => { res.status(201).json({success: 'Réservation validé'}) })
               .catch((error) => { res.status(500).json({error: 'Impossible de valider cette reservation'}) })
});

//methode de suppression d'une reservation
app.delete("/deleteReservation/:id", (req, res) => {
    Reservation.deleteOne({ _id: req.params.id})
               .then(() => { res.status(200).json({success: 'Réservation refusé'}) })
               .catch((error) => { res.status(400).send('Impossible de supprimer cette réservation') })
});



module.exports = app;