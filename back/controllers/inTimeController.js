/**
 * Ce controlleur s'occupe du module InTIme
 * Il gere l'objet InTime et l'objet IpAdress qui sert à stocker les adresse ip de references
 */

const express = require('express');
const app = require('express');
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


//Methode de pointage depart
app.patch("/just-gone", (req, res) => {
    const userId = req.body.user_id;
    const outTime = req.body.outDate;
    const dateOfToday = req.body.dateOfToday;
    const ipAdress = req.body.ipAddress;

    let statut = 'présent';

    //Methode pour definir le statut de l'utilisateur
    

    InTime.updateOne({ user_id: userId, ip_adress: ipAdress, date_of_the_day: dateOfToday }, {
        out_time: outTime,
        statut: statut,
    })
    .then((response) => { res.status(200).send(response) })
    .catch((error) => { res.status(400).send(error) });

});


//Methode d'ajout d'une adresse ip de reference




//methode de recuperation de la liste de présence de tous les utilisateurs



//methode de recuperation de la liste de presence de tous les utilisateurs par dates



//Methode de recuperation de la liste de presence d'un utilisateur via son id



//Methode de recuperation de la liste de presence d'un utilisateur via son id et sur une plage de date



module.exports = app;