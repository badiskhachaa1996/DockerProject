const express = require("express");
const mongoose = require("mongoose")
const Sujet = mongoose.model('sujet')
const app = express(); //à travers ça je peux faire la creation des services
const { Ticket } = require("./../models/Ticket");
const { User } = require("./../models/User");
const nodemailer = require('nodemailer');

//creation d'un transporter smtp
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
        date_ajout: Date.now()
    });

    ticket.save((err, doc) => {
        res.send({ message: "Votre ticket a été crée!", doc });
    });
});


//Suppression d'un ticket
app.get("/deleteById/:id", (req, res) => {
    Ticket.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.send(err)
        }
        res.send(user)
    })
});

//Modification d'un ticket
app.post("/updateById/:id", (req, res) => {
    Ticket.findByIdAndUpdate(req.params.id,
        {
            sujet_id: req.body?.sujet_id,
            agent_id: req.body?.agent_id,
            statut: req.body?.statut,
            date_affec_accep: req.body?.date_affec_accep,
            temp_traitement: req.body?.temp_traitement,
            temp_fin: req.body?.temp_fin,
            isAffected: req.body?.isAffected,
            description: req.body?.description

        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            res.send(user)


        })
});

//Récuperer un ticket
app.get("/getById/:id", (req, res) => {
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
            console.log(err);
        })
});

//Récupérer tous les tickets d'un User
app.get("/getAllbyUser/:id", (req, res) => {
    Ticket.find({ createur_id: req.params.id },null,{sort:{date_ajout:1}})
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.log(err);
        })
});
//Récupérer le premier message d'un Ticket
app.get("/getFirstMessage/:id", (req, res) => {
    Ticket.findOne({ _id: req.params.id }).sort({ date_ajout: 1 }).then((dataMessage) => {
        res.status(200).send({ dataMessage });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })

})

//Récupérer la queue d'entrée
app.get("/getQueue", (req, res) => {
    Ticket.find({ statut: "Queue d'entrée" },null,{sort:{date_ajout:1}})
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.log(err);
        })

})

//Récupérer les Tickets Acceptes ou Affectés
app.get("/getAccAff/:id", (req, res) => {
    Ticket.find({ agent_id: req.params.id },null,{sort:{date_affec_accep:1}})//Et "En attente d'une réponse"
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.log(err);
        })

})

//Update d'un ticket et de son premier Message
app.post("/updateFirst/:id", (req, res) => {
    Ticket.findByIdAndUpdate(req.params.id,
        {
            sujet_id: req.body.sujet_id,
            description: req.body.description
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }


            console.log(user.createur_id)
            res.send( user );
          /*
            User.findOne({ _id: user.createur_id }).then((userFromDb) => {



                let html1 = '<h3 style="color:red"> Notification ! </3> <p style="color:black">Bonjour  '+userFromDb.firstname+' '+userFromDb.lastname+', '+ ' </P> <p style="color:black"> Votre ticket  << Id : ' + user._id + ' >> a été modifié ! </p><p style="color:black">Cordialement,</p> <footer> <img  src="red"/> </footer>';
                   
                let mailOptions = {
                    from: 'estya-ticketing@estya.com',
                    to: userFromDb.email,
                    subject: 'Notification E-Ticketing',
                    html: html1,
                    attachments: [{
                        filename: 'signature.png',
                        path: 'assets/signature.png',
                        cid: 'red' //same cid value as in the html img src
                    }]

                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }).catch((error) => {
                res.status(404).send("erreur :" + error);
            }) */

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
            Ticket.find({ $or: [{ statut: "En cours de traitement" }, { statut: "En attente d'une réponse" }] },null,{sort:{date_affec_accep:1}})
                .then(result => {
                    result.forEach(ticket => {
                        if (listSujetofService.includes(ticket.sujet_id.toString())) {
                            TicketList.push(ticket)
                        }
                    })
                    res.status(200).send({ TicketList })
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
})

//Get All Tickets de la queue d'entrée by Service ID
app.get("/getQueueByService/:id", (req, res) => {
    let id = req.params.id
    console.log(id)
    let listSujetofService = []
    let TicketList = []
    Sujet.find()
        .then(listSujets => {
            listSujets.forEach(sujet => {
                if (sujet.service_id == id) {
                    listSujetofService.push(sujet._id.toString())
                }
            });
            Ticket.find({ statut: "Queue d'entrée" },null,{sort:{date_ajout:1}})
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
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
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
            Ticket.find({ $or: [{ statut: "En cours de traitement" }, { statut: "En attente d'une réponse" }] },null,{sort:{date_affec_accep:1}})
                .then(result => {
                    let listTicket = result.length > 0 ? result : []
                    listTicket.forEach(ticket => {
                        if (ticket.sujet_id in listSujetofService) {
                            TicketList.push(ticket)
                        }
                    })
                    res.status(200).send({ TicketList })
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
})

app.post("/AccAff/:id", (req, res) => {
    Ticket.findByIdAndUpdate(req.params.id,
        {
            agent_id: req.body.agent_id,
            statut: "En cours de traitement",
            date_affec_accep: Date.now(),
            isAffected: req.body?.isAffected || false
        },
        { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            } else {
                console.log(user.createur_id)


                res.send(user);
                User.findOne({ _id: user.agent_id }).then((userFromDb) => {



                    let html2 = '<h3 style="color:red"> Notification ! </3> <p style="color:black">Bonjour ' + 'M.' + userFromDb.lastname + '</p> <p style="color:black"> Le ticket : << ' + user.description + ' >> vous a été  affecter </p></br><p style="color:black">Cordialement,</p> <img src="red"/> ';
                    let mailOptions = {
                        from: 'estya-ticketing@estya.com',
                        to: userFromDb.email,
                        subject: 'Notification E-Ticketing',
                        html: html2,
                        attachments: [{
                            filename: 'signature.png',
                            path: 'assets/signature.png',
                            cid: 'red' //same cid value as in the html img src
                        }]
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }).catch((error) => {
                    res.status(404).send("erreur :" + error);
                })
            }

        })
});

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
                console.log(ticket.createur_id)
                User.findOne({ _id: ticket.createur_id }).then((userFromDb) => {
                    let html3 = '<h3 style="color:red"> Notification ! </3> <p style="color:black">Bonjour ' + 'M.' + userFromDb.lastname + '</p> <p style="color:black"> Nous avons modifié  le service et le sujet de votre ticket <<'+ticket.description+'>></p></br><p style="color:black">Cordialement,</p> <img src="red"/> ';
                    
                    let mailOptions = {
                        from: 'estya-ticketing@estya.com',
                        to: userFromDb.email,
                        subject: 'Notification E-Ticketing',
                        html: html3,
                        attachments: [{
                            filename: 'signature.png',
                            path: 'assets/signature.png',
                            cid: 'red' //same cid value as in the html img src
                        }]

                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });


                }).catch((error) => {
                    res.status(404).send("erreur :" + error);
                })

            }

        })
});

app.post("/changeStatut/:id", (req, res) => {
    Ticket.findByIdAndUpdate(req.params.id,
        {
            statut: req.body.statut
        },
        { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            } else {


                console.log(user.createur_id)
                if (user.statut == "En attente d\'une réponse") {



                    User.findOne({ _id: user.createur_id }).then((userFromDb) => {
                        
                        let html4 = '<h3 style="color:red">Notification !<p style="color:black"> Bonjour  M.' + userFromDb.lastname + ',</p><p style="color:black"> Votre ticket  << ' + user.description + '  >>  est en attente d\'une réponse  </p><p>Une réponse est attendue de votre part</p> <p style="color:black"> Cordialement,</p> <img src="red"> ';
                    
                        let mailOptions = {
                            from: 'estya-ticketing@estya.com',
                            to: userFromDb.email,
                            subject: 'Notification E-Ticketing',
                            html:html4,
                            attachments: [{
                                filename: 'signature.png',
                                path: 'assets/signature.png',
                                cid: 'red' //same cid value as in the html img src
                            }]

                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        res.status(200).send(user)
                    }).catch((error) => {
                        res.status(404).send("erreur :" + error);
                    })

                }
                else if (user.statut === "Traité") {

                   
                    let agentService;
                    User.findOne({ _id: user.createur_id }).then((userFromDb) => {
                        
                        let html5 ='<h3 style="color:red">Notification !<p style="color:black"> Bonjour  M.' + userFromDb.lastname + ',</p><p style="color:black"> votre ticket  << ' + user.description+ '   >> à été traité   </p><p>Connectez vous sur l\'application pour consulter la réponse </p> <p style="color:black"> Cordialement,</p> <img src="red"> ';

                        let mailOptions = {
                            from: 'estya-ticketing@estya.com',
                            to: userFromDb.email,
                            subject: 'Notification E-Ticketing',
                            html: html5,
                            attachments: [{
                                filename: 'signature.png',
                                path: 'assets/signature.png',
                                cid: 'red' //same cid value as in the html img src
                            }]

                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        res.status(200).send(user)
                    }).catch((error) => {
                        res.status(404).send("erreur :" + error);
                    })



                }


            }

        })
});
//Get All Tickets Accepted or Affected by Service ID
app.get("/getAllAccAff", (req, res) => {
    Ticket.find({ $or: [{ statut: "En cours de traitement" }, { statut: "En attente d'une réponse" }, { statut: "Traité" }] },null,{sort:{date_affec_accep:1}})
        .then(result => {
            res.status(200).send(result.length > 0 ? result : [])
        })
        .catch(err => {
            console.log(err);
        })
})

app.post("/revertTicket/:id", (req, res) => {
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

        }, {upsert: true, new: true }).then((docs)=>{
            if(docs) {
               res.status(200).send(docs)
            } else {
              res.status(500).send(docs)
            }
        }).catch((err)=>{
            res.status(500).send(err)
        });
})
module.exports = app;
