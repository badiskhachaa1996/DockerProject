const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Notification } = require("./../models/notification");
const fs = require("fs");
const { Ticket } = require("../models/ticket");
const io = require("socket.io");
const nodemailer = require('nodemailer');
const { User } = require("../models/user");
let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'ims@intedgroup.com',
        pass: 'InTeDGROUP@@0908',
    },
});


//Création d'une nouvelle notification
app.post("/create", (req, res) => {
    if (req.body.type == "Traitement de votre ticket") {
        //Si le ticket est traité alors on supprime tout les notifications lié à ce ticket
        Notification.deleteMany({ info_id: req.body.info_id }, (err, resultat) => {
            if (err) {
                res.send(err)
            }
        });
    }
    const notif = new Notification({
        etat: false,
        type: req.body.type,
        info_id: req.body.info_id,
        date_ajout: Date.now(),
        user_id: req.body.user_id,
        service_id: req.body.service_id
    });


    notif.save((err, user) => {
        res.send({ message: "Votre notif a été crée!", doc: user });
    });

});

app.post('/createV2', (req, res) => {
    User.find({ roles_list: { $elemMatch: { module: req.body.module, role: req.body.role } } }).then(users => {
        users.forEach(u => {
            const notif = new Notification({
                ...req.body,
                date_ajout: Date.now(),
                user_id: u._id
            });


            notif.save((err, user) => {

            });
        })
        res.send(users);
    })

})


//Suppression d'une notification
app.get("/deleteById/:id", (req, res) => {
    Notification.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.send(err)
        }
        res.send(user)
    })
});

app.delete("/deleteAll/:id", (req, res) => {
    Notification.deleteMany({ user_id: req.params.id, }, (err, user) => {
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
    Notification.find({ user_id: req.params.id }).then(Notifications => {
        res.status(200).send(Notifications.slice(0, 20))
    })
});
app.get("/getAdmissionNotifi", (req, res) => {
    Notification.find({ info_id: null, etat: false }).then(notifications => {
        res.status(200).send(notifications)
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

app.get('/newDocument/:email_etudiant/:document', (req, res) => {
    let htmlmail = `
    <p style="font-size:20px; color:black">Bonjour,</p>
    <p>   </p>
    <p style="font-size:20px; color:black">Un nouveau document ${req.params.document} est disponible dans votre espace Documents sur <a href='https://ims.intedgroup.com/#/'>IMS</a></p>
    <p style="font-size:20px; color:black">Merci de consulter ce document, si le document ne s'affiche pas merci d'aller régulariser votre situation à l'administration de l'école (15 Rue du Louvre 75001 Paris)</p>
    <p>   </p>
    <p style="font-size:20px; color:red">Ce mail étant envoyé par un robot, merci d'adresser vos demandes à <a href='mailto:m.hue@intedgroup.com'>m.hue@intedgroup.com</a></p>
    <p>   </p>
    <p style="font-size:20px;">Cordialement,</p>
    
    <footer> <img src="cid:red"/></footer>
    `
    let attachments = [{
        filename: 'signature.png',
        path: '/home/ubuntu/ems3/back/assets/ims-intedgroup-logo.png',
        cid: 'red' //same cid value as in the html img src
    }]
    let mailOptions = {
        from: 'ims@intedgroup.com',
        to: req.params.email_etudiant,
        subject: '[IMS] Nouveau Document',
        html: htmlmail,
        attachments: attachments
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        }
    });
})

app.post("/newEtudiantIMS", (req, res) => {
    let htmlmail = `
    <p style="font-size:20px; color:black">Bonjour,</p>
    <p>   </p>
    <p style="font-size:20px; color:black">Un nouveau étudiant `+ req.body.lastname + ' ' + req.body.firstname + ` s'est inscrit sur la plateforme <a href='https://ims.intedgroup.com'>IMS</a>.</p>
    <p style="font-size:20px; color:black">Merci de vérifier ces documents et de le mettre dans la bonne formation avec <a href='https://ims.intedgroup.com/#/validation-inscrit'>cette page</a></p>
    <p>   </p>
    <p style="font-size:20px; color:red">Ce mail étant envoyé par un robot, merci d'adresser vos demandes à <a href='mailto:m.hue@intedgroup.com'>m.hue@intedgroup.com</a></p>
    <p>   </p>
    <p style="font-size:20px;">Cordialement,</p>
    
    <footer> <img src="cid:red"/></footer>
    `
    let attachments = [{
        filename: 'signature.png',
        path: '/home/ubuntu/ems3/back/assets/ims-intedgroup-logo.png',
        cid: 'red' //same cid value as in the html img src
    }]
    let mailOptions = {
        from: 'ims@intedgroup.com',
        to: ['administration.paris@estya.com'],
        subject: '[IMS] Nouveau Etudiant',
        html: htmlmail,
        attachments: attachments
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        }
    });
})

module.exports = app;