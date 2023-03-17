/**
 * Ce controlleur s'occupe du module InTime
 * Il gere l'objet InTime et l'objet IpAdress qui sert à stocker les adresse ip de references
 */

const express = require('express');
const app = express();
app.disable("x-powered-by");
const { InTime } = require('./../models/InTime');
const { IpAdress } = require('./../models/IpAdress')


//Methode de pointage arrivé
app.post("/just-arrived", (req, res) => {
    const inTime = new InTime({ ...req.body });

    inTime.save()
          .then((response) => { res.status(201).send(response); })
          .catch((error) => { res.status(500).send(error.message) });
});


// methode de check out
app.patch("/patch-check-out", (req, res, next) => {
    const check = new InTime({ ...req.body });
    const outDate = new Date();

    let inDate = check.in_date;
    //Methode pour definir le statut de l'utilisateur calcule de la difference entre le inDate et le outDate
    let statut = undefined;
    var nbHeureTravail = ((outDate - inDate)/1000)/3600;

    // let nbHeureTravail = moment(inDate).diff(outDate, 'hours'); 
    if(nbHeureTravail >= 7 && nbHeureTravail < 9)
    {
        statut = 'Présent toute la journée';
    }
    else if(nbHeureTravail > 9)
    {
        statut = "Dépointage au délà de 9h de temps";
    }
    else if(nbHeureTravail < 7)
    {
        statut = "Parti avant l'heure";
    }
    else 
    {
        statut = "Inconnue";
    }

    InTime.updateOne({ _id: check._id }, { out_date: outDate, craIsValidate: true, statut: statut })
    .then((response) => { res.status(201).json({ success: "Merci d'avoir validé votre journée", check: response }); })
    .catch((error) => { console.log(error); res.status(400).json({ error: 'Impossible de valider votre CheckOut, veuillez contacter un administrateur' }); });
});


//methode de recuperation de la liste de présence de tous les utilisateurs
app.get("/get-all-populate-user-id", (_, res) => {
    InTime.find().populate('user_id')
          .then((inTimes) => { res.status(200).send(inTimes); })
          .catch((error) => { res.status(500).send(error.message) });
});


//methode de recuperation de la liste de presence de tous les utilisateurs sur interval de date
app.get("/get-all-by-date-between-populate-user-id/:beginDate/:endDate", (req, res) => {
    //Traitement sur les date envoyé dans l'url
    let originalBeginDate = req.params.beginDate;
    let originalEndDate = req.params.endDate;

    InTime.find({ date_of_the_day:{ $gte: req.params.beginDate, $lte: req.params.endDate } }).populate('user_id')
        .then((inTimes) => { res.status(200).send(inTimes) })
        .catch((error) => { res.status(400).send(error.message) });
});


//methode de recuperation de la liste de presence de tous les utilisateurs par date
app.get("/get-all-by-date/:dateOfTheDay", (req, res) => {
    InTime.find({ date_of_the_day: req.params.dateOfTheDay })
          .then((inTimes) => { res.status(200).send(inTimes) })
          .catch((error) => { res.status(400).send(error.message) });
});


//Methode de recuperation de la liste de presence d'un utilisateur via son id
app.get("/get-all-by-user-id/:userId", (req, res) => {
    InTime.find({ user_id: req.params.userId })
          .then((inTimes) => { res.status(200).send(inTimes) })
          .catch((error) => { res.status(400).send(error.message) });
});


//Methode de recuperation de la liste de presence d'un utilisateur via son id et sur une plage de date
app.get("/get-all-by-userId-between/:userId/:from/:to", (req, res) => {
    InTime.find({ user_id: req.params.userId, date_of_the_day: { $gte: req.params.from, $lt: req.params.to } })
          .then((inTimes) => { res.status(200).send(inTimes) })
          .catch((error) => { res.status(400).send(error.message) });
});


//Recuperation de la presence d'un utilisateur via une date et un id
app.get("/get-by-date-by-user-id/:userId/:dateOfTheDay", (req, res) => {
    InTime.findOne({ user_id: req.params.userId, date_of_the_day: req.params.dateOfTheDay })
          .then((inTime) => { res.status(200).send(inTime) })
          .catch((error) => { res.status(400).send(error.message) });
});


// modification d'un check
app.patch("/patch-check", (req, res) => {
    const check = new InTime({ ...req.body });

    InTime.updateOne({ _id: check._id }, { ...req.body })
    .then((response) => { res.status(201).json({success: 'Check mis à jour', check: response }) })
    .catch((error) => { console.log(error); res.status(400).json({error: 'Impossible de mettre le check à jour'}) });
});


module.exports = app;