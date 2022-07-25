const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Notification } = require("./../models/notification");
const fs = require("fs");
const { Ticket } = require("../models/ticket");
const io = require("socket.io");

//Création d'une nouvelle notification
app.post("/create", (req, res) => {
    console.log(req.body)
    if (req.body.type == "Traitement de votre ticket") {
        //Si le ticket est traité alors on supprime tout les notifications lié à ce ticket
        Notification.deleteMany({ info_id: req.body.info_id }, (err, resultat) => {
            if (err) {
                res.send(err)
            }
        });
    }
    const notif = new Notification({
        etat: req.body.etat,
        type: req.body.type,
        info_id: req.body.info_id,
        date_ajout: Date.now(),
        user_id: req.body.user_id
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
            console.error(err);
        })
});
//Récuperer tous les notifications d'un user
app.get("/getAllByUserID/:id", (req, res) => {
    Notification.find({ user_id: req.params.id, etat: false }).then(Notifications => {
        res.status(200).send(Notifications)
    })
});

//Récuperer les 20 notifications dernières d'un user
app.get("/get20ByUserID/:id", (req, res) => {
    Notification.find({ user_id: req.params.id, etat: false }).then(Notifications => {
        console.log(Notification)
        res.status(200).send(Notifications.slice(0, 20))
    })
});
app.get("/get20AdmissionNotifi", (req, res) => {
    Notification.find({ info_id:null, etat: false }).then(notifications => {
console.log(notifications)
objet20notif =notifications.slice(0, 20)
        res.status(200).send(objet20notif)
    }).catch(error => { console.log(error) })
});

app.post("/viewNotifs", (req, res) => {
    //Passe en vue une liste de notifications
    let notifications = req.body.notifications;
    let returnTick = [];
    notifications.forEach(element => {
        Notification.findByIdAndUpdate(element._id,
            {
                etat: true,

            }, { new: true }, (err, notif) => {
                if (err) {
                    res.send(err)
                }
                returnTick.push(notif)
            })
    });
    res.status(200).send(returnTick)
});

module.exports = app;