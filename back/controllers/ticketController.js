const express = require("express");
const mongoose = require("mongoose")
const Sujet = mongoose.model('sujet')
const app = express();
app.disable("x-powered-by");
const { Ticket } = require("../models/ticket");
const { User } = require("../models/user");
const nodemailer = require('nodemailer');

//creation d'un transporter smtperrFile
let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'estya-ticketing@estya.com',
        pass: 'ESTYA@@2021',
    },
});

//Création d'un nouveau ticket
app.post("/create", (req, res) => {
    const ticket = new Ticket({
        createur_id: req.body.id,
        sujet_id: req.body.sujet_id,
        description: req.body.description,
        date_ajout: Date.now(),
        customid: req.body.customid
    });

    ticket.save((err, doc) => {
        res.send({ message: "Votre ticket a été crée!", doc });
        Sujet.findOne({ _id: req.body.sujet_id }, (err3, sujet) => {
            User.find({ service_id: sujet.service_id, role: "Responsable" }, (err2, listResponsable) => {
                listResponsable.forEach(responsable => {
                    let gender = (responsable.civilite == 'Monsieur') ? 'M. ' : 'Mme ';
                    let htmlemail = '<p style="color:black"> Bonjour  ' + gender + responsable.lastname + ',</p> </br> <p style="color:black"> Le ticket qui a pour numéro : <b> ' + doc.customid + ' </strong> est arrivé dans la fil d\'attente de votre service <b>' + doc.description + ' </strong></p></br><p style="color:black">Cordialement,</p> <img  src="red"/> '
                    let mailOptions = {
                        from: 'estya-ticketing@estya.com',
                        to: responsable.email,
                        subject: '[ESTYA Ticketing] - Notification ',
                        html: htmlemail,
                        priority: 'high',
                        attachments: [{
                            filename: 'signature.png',
                            path: 'assets/signature.png',
                            cid: 'red' //same cid value as in the html img src
                        }]
                    };


                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.error(error);
                        }
                    });
                })
            })
        })
    });
});


//Suppression d'un ticket
app.get("/deleteById/:id", (req, res) => {
    Ticket.findByIdAndRemove(req.params.id, (err, ticket) => {
        if (err) {
            res.send(err)
        }
        res.send(ticket)
    })
});

//Modification d'un ticket
app.post("/updateAllById/:id", (req, res) => {
    Ticket.findByIdAndUpdate(req.params.id,
        {
            sujet_id: req.body?.sujet_id,
            agent_id: req.body?.agent_id,
            statut: req.body?.statut,
            date_affec_accep: req.body?.date_affec_accep,
            isAffected: req.body?.isAffected,
            description: req.body?.description

        }, { new: true }, (err, ticket) => {
            if (err) {
                res.send(err)
            }
            res.send(ticket)


        })
});

//Récuperer un ticket
app.post("/getById/:id", (req, res) => {
    Ticket.findOne({ _id: req.params.id }).then((dataTicket) => {
        res.status(200).send({ dataTicket });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});
//Récuperer tous les tickets
app.get("/getAll", (req, res) => {
    Ticket.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })
});

//Récupérer tous les tickets d'un User
app.get("/getAllbyUser/:id", (req, res) => {
    Ticket.find({ createur_id: req.params.id }, null, { sort: { date_ajout: 1 } })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })
});

//Récupérer la queue d'entrée
app.get("/getQueue", (req, res) => {
    Ticket.find({ statut: "Queue d'entrée" }, null, { sort: { date_ajout: 1 } })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })

})

//Récupérer les Tickets Acceptes ou Affectés d'un agent
app.get("/getAccAff/:id", (req, res) => {
    Ticket.find({ agent_id: req.params.id }, null, { sort: { date_affec_accep: 1 } })//Et "En attente d'une réponse"
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })

})

//Update d'un ticket
app.post("/update/:id", (req, res) => {
    Ticket.findByIdAndUpdate(req.params.id,
        {
            sujet_id: req.body.sujet_id,
            description: req.body.description
        }, { new: true }, (err, ticket) => {
            if (err) {
                res.send(err)
            }
            res.send(ticket);
        })
});

//Get All Tickets by Service ID
app.get("/getTicketsByService/:id", (req, res) => {
    let id = req.params.id
    let listSujetofService = []
    let TicketList = []
    Sujet.find()
        .then(listSujets => {
            listSujets.forEach(sujet => {
                if (sujet.service_id == id) {
                    listSujetofService.push(sujet._id.toString())

                }
            });
            Ticket.find({ $or: [{ statut: "En cours de traitement" }, { statut: "En attente d'une réponse" }, { statut: "Traité" }] }, null, { sort: { statut: 1 } })
                .then(result => {
                    result.forEach(ticket => {
                        if (listSujetofService.includes(ticket.sujet_id.toString())) {
                            TicketList.push(ticket)
                        }
                    })
                    res.status(200).send({ TicketList })
                })
                .catch(err => {
                    console.error(err);
                })
        })
        .catch(err => {
            console.error(err);
        })
})

//Get All Tickets de la queue d'entrée by Service ID
app.get("/getQueueByService/:id", (req, res) => {
    let id = req.params.id
    let listSujetofService = []
    let TicketList = []
    Sujet.find()
        .then(listSujets => {
            listSujets.forEach(sujet => {
                if (sujet.service_id == id) {
                    listSujetofService.push(sujet._id.toString())
                }
            });
            Ticket.find({ statut: "Queue d'entrée" }, null, { sort: { date_ajout: 1 } })
                .then(result => {
                    let listTicket = result.length > 0 ? result : []
                    listTicket.forEach(ticket => {
                        if (listSujetofService.includes(ticket.sujet_id.toString())) {
                            TicketList.push(ticket)
                        }
                    })
                    res.status(200).send({ TicketList })
                })
                .catch(err => {
                    console.error(err);
                })
        })
        .catch(err => {
            console.error(err);
        })
})

//Get All Tickets Accepted or Affected by Service ID
app.get("/getAccAffByService/:id", (req, res) => {
    let id = req.params.id
    let listSujetofService = []
    let TicketList = []
    Sujet.find()
        .then(listSujets => {
            listSujets.forEach(sujet => {
                if (sujet.service_id == id) {
                    listSujetofService.push(sujet._id)
                }
            });
            Ticket.find({ $or: [{ statut: "En cours de traitement" }, { statut: "En attente d'une réponse" }] }, null, { sort: { date_affec_accep: 1 } })
                .then(result => {
                    let listTicket = result.length > 0 ? result : []
                    listTicket.forEach(ticket => {
                        if (listSujetofService.includes(ticket.sujet_id.toString())) {
                            TicketList.push(ticket)
                        }
                    })
                    res.status(200).send({ TicketList })
                })
                .catch(err => {
                    console.error(err);
                })
        })
        .catch(err => {
            console.error(err);
        })
})

//Change l'état d'un ticket en Accepté ou Affecté
app.post("/AccAff/:id", (req, res) => {
    Ticket.findByIdAndUpdate(req.params.id,
        {
            agent_id: req.body.agent_id,
            statut: "En cours de traitement",
            date_affec_accep: Date.now(),
            isAffected: req.body?.isAffected || false
        },
        { new: true }, (err, ticket) => {
            if (err) {
                res.send(err)
            } else {
                res.send(ticket);
                if (ticket.isAffected) {
                    User.findOne({ _id: ticket.agent_id }).then((userFromDb) => {
                        let gender = (userFromDb.civilite == 'Monsieur') ? 'M. ' : 'Mme ';
                        let html2 = '<p style="color:black">Bonjour ' + gender + userFromDb.lastname + '</p><br><p style="color:black"> Le ticket qui a pour numéro : <b> ' + ticket.customid + '</strong> et qui a pour description <b> ' + ticket.description + ' </strong> vous a été affecter. </p></br><p style="color:black">Cordialement,</p> <img src="red"/> ';
                        let mailOptions = {
                            from: 'estya-ticketing@estya.com',
                            to: userFromDb.email,
                            subject: '[ESTYA Ticketing] - Notification',
                            html: html2,
                            attachments: [{
                                filename: 'signature.png',
                                path: 'assets/signature.png',
                                cid: 'red' //same cid value as in the html img src
                            }]
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.error(error);
                            }
                        });
                    }).catch((error) => {
                        console.error(error)
                        res.status(404).send(error);
                    })
                }

            }

        })
});

//Change le service d'un ticket
app.post("/changeService/:id", (req, res) => {
    Ticket.findByIdAndUpdate(req.params.id,
        {
            sujet_id: req.body.sujet_id
        },
        { new: true }, (err, ticket) => {
            if (err) {
                res.send(err)
            } else {
                res.status(200).send(ticket)
                User.findOne({ _id: ticket.createur_id }).then((userFromDb) => {
                    let gender = (userFromDb.civilite == 'Monsieur') ? 'M. ' : 'Mme ';
                    let html3 = '<p style="color:black">Bonjour ' + gender + userFromDb.lastname + '</p><br><p style="color:black"> Votre ticket qui a pour numéro : <b> ' + ticket.customid + '</strong> et qui a pour description : <b> ' + ticket.description + ' </strong> a été redirigé vers un autre service ou un autre sujet par un agent. </br><p style="color:black">Cordialement,</p> <img src="red"/> ';

                    let mailOptions = {
                        from: 'estya-ticketing@estya.com',
                        to: userFromDb.email,
                        subject: '[ESTYA Ticketing] - Notification ',
                        html: html3,
                        attachments: [{
                            filename: 'signature.png',
                            path: 'assets/signature.png',
                            cid: 'red' //same cid value as in the html img src
                        }]

                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.error(error);
                        }
                    });


                }).catch((error) => {
                    console.error(error)
                })

            }

        })
});

//Change le statut d'un ticket
app.post("/changeStatut/:id", (req, res) => {
    Ticket.findByIdAndUpdate(req.params.id,
        {
            statut: req.body.statut
        },
        { new: true }, (err, ticket) => {
            if (err) {
                res.send(err)
            } else {
                if (ticket.statut == "En attente d\'une réponse") {
                    User.findOne({ _id: ticket.createur_id }).then((userFromDb) => {
                        let gender = (userFromDb.civilite == 'Monsieur') ? 'M. ' : 'Mme ';
                        let html4 = '<p style="color:black"> Bonjour  ' + gender + userFromDb.lastname + ',</p><br><p style="color:black">  Vous avez reçu un nouveau message pour le ticket qui a pour numéro : <b> ' + ticket.customid + '  </strong> et qui a pour description : <b> ' + ticket.description + '</strong>.</p><p>Une réponse est attendue de votre part.</p> <p style="color:black"> Cordialement,</p> <img src="red"> ';
                        let mailOptions = {
                            from: 'estya-ticketing@estya.com',
                            to: userFromDb.email,
                            subject: '[ESTYA Ticketing] - Notification',
                            html: html4,
                            attachments: [{
                                filename: 'signature.png',
                                path: 'assets/signature.png',
                                cid: 'red' //same cid value as in the html img src
                            }]

                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.error(error);
                            }
                        });

                    }).catch((error) => {
                        console.error(error)
                    })

                }
                else if (ticket.statut === "Traité") {
                    Ticket.findByIdAndUpdate(req.params.id,
                        {
                            date_fin_traitement: Date.now()

                        }, { new: true }, (err, dataUpdated) => {
                            if (err) {
                                res.send(err)
                            }
                        })
                    User.findOne({ _id: ticket.createur_id }).then((userFromDb) => {
                        let gender = (userFromDb.civilite == 'Monsieur') ? 'M. ' : 'Mme ';
                        let html5 = '<p style="color:black"> Bonjour ' + gender + userFromDb.lastname + ',</p><br><p style="color:black">  Votre ticket qui a pour numéro : <b> ' + ticket.customid + '  </strong> et qui a pour description : <b> ' + ticket.description + '</strong> a été traité</p><p style="color:black"> Cordialement,</p> <img src="red"> ';
                        let mailOptions = {
                            from: 'estya-ticketing@estya.com',
                            to: userFromDb.email,
                            subject: '[ESTYA Ticketing] - Notification',
                            html: html5,
                            attachments: [{
                                filename: 'signature.png',
                                path: 'assets/signature.png',
                                cid: 'red' //same cid value as in the html img src
                            }]
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.error(error);
                            }
                        });
                    }).catch((error) => {
                        console.error(error)
                    })
                }
            }
            res.status(200).send(ticket)
        })
});

//Get All Tickets Accepted or Affected by Service ID
app.get("/getAllAccAff", (req, res) => {
    Ticket.find({ $or: [{ statut: "En cours de traitement" }, { statut: "En attente d'une réponse" }, { statut: "Traité" }] }, null, { sort: { statut: 1 } })
        .then(result => {
            res.status(200).send(result.length > 0 ? result : [])
        })
        .catch(err => {
            console.error(err);
        })
})

//Renvoie un ticket dans la queue d'entrée
app.post("/revertTicket/:id", (req, res) => {
    Ticket.findById(req.params.id).then((ticket) => {
        User.findOne({ _id: ticket.agent_id }).then((userFromDb) => {
            if (req.body.revertedByAdmin) {
                let gender = (userFromDb.civilite == 'Monsieur') ? 'M. ' : 'Mme ';
                let htmlemail = '<p style="color:black"> Bonjour  ' + gender + userFromDb.lastname + ',</p> </br> <p style="color:black"> Le ticket qui a pour numéro : <b> ' + ticket.customid + ' </strong> que vous gériez et qui a pour description <b>' + ticket.description + ' </strong>à été renvoyé dans la queue d\'entrée par un responsable</p></br><p style="color:black">Cordialement,</p> <img  src="red"/> '
                let mailOptions = {
                    from: 'estya-ticketing@estya.com',
                    to: userFromDb.email,
                    subject: '[ESTYA Ticketing] - Notification ',
                    html: htmlemail,
                    attachments: [{
                        filename: 'signature.png',
                        path: 'assets/signature.png',
                        cid: 'red' //same cid value as in the html img src
                    }]
                };


                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.error(error);
                    }
                });
            }
        }).catch((error) => {
            console.error(error)
        })
    }).catch((error) => {
        console.error(error)
    })
    Ticket.findOneAndUpdate({ _id: req.params.id },
        {
            isReverted: true,
            justificatif: req.body.justificatif,
            isAffected: null,
            date_affec_accep: null,
            agent_id: null,
            statut: "Queue d'entrée",
            date_revert: Date.now(),
            user_revert: req.body.user_revert

        }, { upsert: true, new: true }).then((docs) => {
            if (docs) {
                res.status(200).send(docs)
            } else {
                res.status(500).send(docs)
            }
        }).catch((err) => {
            console.error(err)
        });
})

//Création d'un nouveau ticket
app.post("/createForUser", (req, res) => {
    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            const ticket = new Ticket({
                createur_id: user._id,
                sujet_id: req.body.sujet_id,
                description: req.body.description,
                date_ajout: Date.now(),
                customid: req.body.customid
            });

            ticket.save((err, doc) => {
                res.send({ message: "Votre ticket a été crée!", doc });
            });
        } else {
            let newUser = new User({
                firstname: req.body.email[0],
                lastname: req.body.email.substring(req.body.email.indexOf('.') + 1, req.body.email.indexOf('@')),
                email: req.body.email,
                role: "user",
                service_id: null
            })

            newUser.save().then((userFromDb) => {
                const ticket = new Ticket({
                    createur_id: userFromDb._id,
                    sujet_id: req.body.sujet_id,
                    description: req.body.description,
                    date_ajout: Date.now(),
                    customid: req.body.customid
                });

                ticket.save((err, doc) => {
                    res.send({ message: "Votre ticket a été crée!", doc });
                });
            })
        }
    })
});

//Requête de récupération du nombre de ticket dans la file d'attente
app.get("/getCountWaiting", (req, res, next) => {
    Ticket.find({ statut: 'Queue d\'entrée' })
          .then((ticket) => { res.status(200).send(ticket); })
          .catch((error) => { res.status(500).send(error); });
});

//Requête de récupération du nombre de ticket en cours de traitement
app.get("/getCountTraitement", (req, res, next) => {
    Ticket.find({ statut: 'En cours de traitement' })
          .then((ticket) => { res.status(200).send(ticket); })
          .catch((error) => { res.status(500).send(error); })
});

//Requête de récupération du nombre de ticket traités
app.get("/getCountTraite", (req, res, next) => {
    Ticket.find({ statut: 'Traité' })
        .then((ticket) => { res.status(200).send(ticket); })
        .catch((error) => { res.status(500).send(error); })
});

//Requête de récupération du nombre de ticket crée par un user en cours de traitement
app.get("/getCountTicketUserInWaiting/:id", (req, res) => {
    Ticket.find({ createur_id: req.params.id, statut: 'En cours de traitement' })
        .then((ticket) => { res.status(200).send(ticket); })
        .catch((error) => { res.status(400).send(error); })
});

//Requête de récupération du nombre de ticket crée par un user traité
app.get("/getCountTicketUserTraite/:id", (req, res) => {
    Ticket.find({ createur_id: req.params.id, statut: 'Traité' })
        .then((ticket) => { res.status(200).send(ticket); })
        .catch((error) => { res.status(400).send(error); })
});

//Requête de récupération du nombre de ticket crée par un user traité
app.get("/getCountTicketUserQueue/:id", (req, res) => {
    Ticket.find({ createur_id: req.params.id, statut: 'Queue d\'entrée' })
        .then((ticket) => { res.status(200).send(ticket); })
        .catch((error) => { res.status(400).send(error); })
});

module.exports = app;
