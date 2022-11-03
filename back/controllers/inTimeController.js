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


//Methode de depointage depart
app.patch("/just-gone", (req, res) => {
    const userId = req.body.user_id;
    const outDate = new Date(req.body.out_date);
    const dateOfToday = req.body.date_of_the_day;
    const ipAdress = req.body.ip_adress;        


    InTime.findOne({ user_id: userId, date_of_the_day: dateOfToday })
          .then((inTimeFromDb) => { 
            let inDate = inTimeFromDb.in_date;
            //Methode pour definir le statut de l'utilisateur calcule de la difference entre le inDate et le outDate
            let statut = undefined;
            var nbHeureTravail = ((outDate - inDate)/1000)/3600;

            // let nbHeureTravail = moment(inDate).diff(outDate, 'hours'); 
            if(nbHeureTravail >= 7 && nbHeureTravail < 9 && ipAdress == inTimeFromDb.in_ip_adress)
            {
                statut = 'présent toute la journée';
            }
            else if(nbHeureTravail > 9 && ipAdress == inTimeFromDb.in_ip_adress)
            {
                statut = "Trop tard";
            }
            else if(nbHeureTravail < 7 && ipAdress == inTimeFromDb.in_ip_adress)
            {
                statut = "Parti avant l'heure";
            }
            else 
            {
                statut = "Inconnue";
            }


            //Mise à jour dans la base de données
            InTime.updateOne({ _id: inTimeFromDb._id }, 
                  {
                    out_date: outDate,
                    out_ip_adress: ipAdress,
                    statut: statut,
                    isCheckable: false,
                  })
                  .then((inTimeUpdated) => { res.status(201).send(inTimeUpdated) })
                  .catch((error) => { res.status(400).send(error.message) })

          })
          .catch((error) => { res.status(500).send(error.message) });

});


//methode de recuperation de la liste de présence de tous les utilisateurs
app.get("/get-all", (_, res) => {
    InTime.find()
          .then((inTimes) => { res.status(200).send(inTimes); })
          .catch((error) => { res.status(500).send(error.message) });
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
    InTime.find({ userId: req.params.userId, date_of_the_day: { $gte: req.params.from, $lt: req.params.to } })
          .then((inTimes) => { res.status(200).send(inTimes) })
          .catch((error) => { res.status(400).send(error.message) });
});


//Recuperation de la presence d'un utilisateur via une date et un id
app.get("/get-by-date-by-user-id/:userId/:dateOfTheDay", (req, res) => {
    InTime.findOne({ user_id: req.params.userId, date_of_the_day: req.params.dateOfTheDay })
          .then((inTime) => { res.status(200).send(inTime) })
          .catch((error) => { res.status(400).send(error.message) });
});


module.exports = app;