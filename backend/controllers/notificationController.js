const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { Notification} = require("./../models/Notification");
const fs = require("fs");
const { Ticket } = require("../models/Ticket");
const io = require("socket.io");

//Création d'une nouvelle notification
app.post("/create", (req, res) => {
    const notif = new Notification({
        etat: req.body.etat,
        type: req.body.type,
        ticket_id: req.body.ticket_id,
        date_ajout: Date.now(),
        user_id:req.body.user_id
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
    Notification.find({user_id:req.params.id,etat:false}).then(Notifications=>{
        res.status(200).send(Notifications)
    })
});

//Récuperer les 20 notifications dernières d'un user
app.get("/get20ByUserID/:id", (req, res) => {
    Notification.find({user_id:req.params.id,etat:false}).then(Notifications=>{
        res.status(200).send(Notifications.slice(0,20))
    })
});

app.get("/viewNotifByID/:id", (req, res) => {
    Notification.findByIdAndUpdate(req.params.id,
        {
            etat:true,
         
        }, {new: true}, (err, notif) => {
            if (err) {
                res.send(err)
            }
            res.send(notif)
        })
});

app.post("/viewNotifs", (req, res) => {
    let notifications=req.body.notifications;
    let returnTick=[];
    notifications.forEach(element => {
        Notification.findByIdAndUpdate(element._id,
            {
                etat:true,
             
            }, {new: true}, (err, notif) => {
                if (err) {
                    res.send(err)
                }
                returnTick.push(notif)
            })
    });
    res.status(200).send(returnTick)
});

module.exports = app;