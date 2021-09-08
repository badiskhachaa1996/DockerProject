const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { Notification} = require("./../models/Notification");
const fs = require("fs");
const { Ticket } = require("../models/Ticket");

//Création d'une nouvelle notification
app.post("/create", (req, res) => {
    const notif = new Notification({
        etat: req.body.etat,
        type: req.body.type,
        ticket_id: req.body.ticket_id,
        date_ajout: Date.now()
    });

    notif.save((err, user) => {
        res.send({ message: "Votre notif a été crée!", doc: user });
    });
});


//Suppression d'une notification
app.get("/deleteById/:id", (req, res) => {
    Notification.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.send(err)
        }
        res.send(user)
    })
});

//Modification d'une notification
app.post("/updateById/:id", (req, res) => {
    Notification.findByIdAndUpdate(req.params.id,
        {
            etat: req.body?.etat,
            type: req.body?.type
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            res.send(user)
        })
});

//Récuperer une notification
app.get("/getById/:id", (req, res) => {
    Notification.findOne({ _id: req.params.id }).then((data) => {
        res.status(200).send({ data });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});

//Récuperer tous les notifications
app.get("/getAll", (req, res) => {
    Notification.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.log(err);
        })
});
//Récuperer tous les notifications d'un user
app.get("/getAllByUserID/:id", (req, res) => {
    let Notifs=[];
    Ticket.find({createur_id:req.params.id}).then(tickets=>{
        let ticketId=[];
        tickets.forEach(ticket=>{
            ticketId.push(ticket._id.toString())
        })
        Notification.find().then(Notifications=>{
            Notifications.forEach(notif => {
                if(ticketId.includes(notif.ticket_id.toString())){
                    Notifs.push(notif)
                }
            });
            res.status(200).send(notif)
        })
    })
});

module.exports = app;