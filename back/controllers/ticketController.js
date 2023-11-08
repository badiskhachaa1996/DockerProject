const express = require("express");
const mongoose = require("mongoose")
const Sujet = mongoose.model('sujet')
const app = express();
app.disable("x-powered-by");
const { Ticket } = require("../models/ticket");
const { User } = require("../models/user");
const nodemailer = require('nodemailer');
const { Etudiant } = require("../models/etudiant");

//creation d'un transporter smtperrFile
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
function entierAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//Création d'un nouveau ticket
app.post("/create", (req, res) => {
    Ticket.find({ sujet_id: req.body.sujet_id }).then(tkt => {
        var lengTicket = tkt.length + 1
        Sujet.findById(req.body.sujet_id).populate('service_id').then(sujet => {
            User.findById(req.body.id).then(u => {
                //Generation Custom ID
                let id = ""
                let d = new Date()
                let month = (d.getUTCMonth() + 1).toString()
                if (d.getUTCMonth() + 1 < 10)
                    month = "0" + month
                let day = (d.getUTCDate()).toString()
                if (d.getUTCDate() < 10)
                    day = "0" + day
                let year = d.getUTCFullYear().toString().slice(-2);
                while (lengTicket > 1000)
                    lengTicket - 1000
                let nb = (lengTicket).toString()
                if (lengTicket < 10)
                    nb = "00" + nb
                if (lengTicket < 100)
                    nb = "0" + nb


                id = "IGTR" + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString()

                const ticket = new Ticket({
                    ...req.body,
                    createur_id: req.body.id,
                    sujet_id: req.body.sujet_id,
                    description: req.body.description,
                    date_ajout: d,
                    customid: id,
                    etudiant_id: req.body.etudiant_id,
                    priorite: req.body.priorite,
                    documents: req.body.documents,
                    module: req.body.module,
                });

                let htmlemail = `
                <p>Bonjour,</p><br>

<p>Nous confirmons la création de votre ticket ${id}, Le sujet de ce ticket est "${sujet.label}". Il a été créé le ${day}/${month}/${year} , dès que le ticket sera traité, vous aurez une notification par email et sur votre compte IMS</p><br>

<p>Cordialement,</p>
                `
                let mailOptions = {
                    from: 'ims@intedgroup.com',
                    to: u.email,
                    subject: '[IMS - Ticketing] - Création d\'un ticket ',
                    html: htmlemail
                };


                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.error(error);
                    }
                });

                ticket.save((err, doc) => {
                    if (err) {
                        console.error(err);
                        res.status(404).send(err)
                    }
                    else
                        res.send({ message: "Votre ticket a été crée!", doc });
                    User.find({ roles_list: { $elemMatch: { module: 'Ticketing', role: 'Super-Admin' } } }).then(users => {
                        //console.log(users)
                        let emailList = []
                        users.forEach(u => {
                            emailList.push(u.email)
                        })
                        let htmlemail = `
                        <p>Bonjour,</p><br>

                        <p>Nous souhaitons vous informer qu'un nouveau ticket a été créé pour le service ${sujet.service_id.label}. Le sujet de ce ticket est " ${sujet.label}". Il a été créé le ${day}/${month}/${year} par ${u.lastname} ${u.firstname}.</p><br>
                        
                        <p>Cordialement,</p>
                        `
                        let mailOptions = {
                            from: 'ims@intedgroup.com',
                            to: emailList,
                            subject: '[IMS - Ticketing] - Création d\'un ticket ',
                            html: htmlemail
                        };


                        /*transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.error(error);
                            }
                        });*/
                    })
                    Sujet.findById(req.body.sujet_id).populate('service_id').then(sujet => {
                        let htmlemail = `
                        <p>Bonjour,</p><br>

                        <p>Nous souhaitons vous informer qu'un nouveau ticket a été créé pour le service ${sujet.service_id.label}. Le sujet de ce ticket est " ${sujet.label}". Il a été créé le ${day}/${month}/${year} par ${u.lastname} ${u.firstname}.</p><br>
                        
                        <p>Cordialement,</p>
                        `
                        let mailOptions = {
                            from: 'ims@intedgroup.com',
                            to: 'ims.support@intedgroup.com',
                            subject: '[IMS - Ticketing] - Nouveau Ticket de ' + sujet.service_id.label,
                            html: htmlemail,
                            priority: 'high',
                            attachments: [{
                                filename: 'signature.png',
                                path: 'assets/ims-intedgroup-logo.png',
                                cid: 'red' //same cid value as in the html img src
                            }]
                        };


                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.error(error);
                            }
                        });
                    })
                });
            })
        })
    })
});

//Création d'un nouveau ticket par un Admin
app.post("/createAdmin", (req, res) => {
    Ticket.find({ agent_id: req.body.agent_id }).then(tkt => {
        var lengTicket = tkt.length + 1
        Sujet.findOne({ service_id: req.body.service_id }).populate('service_id').then(sujet => {
            if (sujet)
                User.findById(req.body.id).then(u => {
                    //Generation Custom ID
                    let id = ""
                    let d = new Date()
                    let month = (d.getUTCMonth() + 1).toString()
                    if (d.getUTCMonth() + 1 < 10)
                        month = "0" + month
                    let day = (d.getUTCDate()).toString()
                    if (d.getUTCDate() < 10)
                        day = "0" + day
                    let year = d.getUTCFullYear().toString().slice(-2);
                    while (lengTicket > 1000)
                        lengTicket - 1000
                    let nb = (lengTicket).toString()
                    if (lengTicket < 10)
                        nb = "00" + nb
                    if (lengTicket < 100)
                        nb = "0" + nb


                    id = id + u.lastname.slice(0, 1) + u.firstname.slice(0, 1) + sujet.service_id.label.slice(0, 1) + sujet.label.slice(0, 1)
                    id = id + day + month + year + nb
                    id = id.toUpperCase()

                    const ticket = new Ticket({
                        createur_id: req.body.id,
                        sujet_id: sujet._id,
                        description: req.body.description,
                        date_ajout: d,
                        customid: id,
                        agent_id: req.body.agent_id,
                        isAffected: true,
                        date_affec_accep: d,
                        statut: "En cours de traitement"
                    });

                    ticket.save((err, doc) => {
                        if (err) {
                            console.error(err);
                            res.status(404).send("Erreur avec la création d'un ticket")
                        }
                        else {
                            res.send({ message: "Votre ticket a été crée!", doc });
                            User.findById(req.body.agent_id).then(responsable => {
                                let gender = (responsable.civilite == 'Monsieur') ? 'M. ' : 'Mme ';
                                let htmlemail = '<p style="color:black"> Bonjour  ' + gender + responsable.lastname + ',</p> </br> <p style="color:black"> Le ticket qui a pour numéro : <b> ' + doc.customid + ' </strong> est arrivé dans la fil d\'attente de votre service <b>' + doc.description + ' </strong></p></br><p style="color:black">Cordialement,</p> <img  src="red"/> '
                                let mailOptions = {
                                    from: 'ims@intedgroup.com',
                                    to: responsable.email,
                                    subject: '[IMS - Ticketing] - Notification ',
                                    html: htmlemail,
                                    priority: 'high',
                                    attachments: [{
                                        filename: 'signature.png',
                                        path: 'assets/ims-intedgroup-logo.png',
                                        cid: 'red' //same cid value as in the html img src
                                    }]
                                };


                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.error(error);
                                    }
                                });
                            })
                        }
                    });
                }).catch(err => {
                    console.error(err);
                    res.status(404).send("Erreur avec votre ID, essayer de vous reconnectez")
                })
            else
                res.status(404).send("Aucun sujet n'existe pour ce service")
        }).catch(err => {
            console.error(err);
            res.status(404).send("Aucun sujet n'existe pour ce service")
        })
    }).catch(err => {
        console.error(err);
        res.status(404).send("Problème de trouver le nombre de tickets de cette agent")
    })
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
app.get("/getById/:id", (req, res) => {
    Ticket.findOne({ _id: req.params.id }).then((dataTicket) => {
        res.status(200).send({ dataTicket });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});
//Récuperer tous les tickets
app.get("/getAll", (req, res) => {
    Ticket.find()?.populate({ path: "task_id", populate: { path: "project_id" } })?.populate('agent_id')
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })
});

//Récupérer tous les tickets d'un User
app.get("/getAllbyUser/:id", (req, res) => {
    Ticket.find({ createur_id: req.params.id }, null, { sort: { date_ajout: 1 } })?.populate('task_id')
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })
});

//Récupérer la queue d'entrée
app.get("/getQueue", (req, res) => {
    Ticket.find({ statut: "Queue d'entrée" }, null, { sort: { date_ajout: 1 } }).populate({ path: "etudiant_id", populate: { path: "classe_id", populate: { path: "diplome_id" } } }).populate({ path: "etudiant_id", populate: { path: "ecole_id" } })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })

})

//Récupérer les Tickets Acceptes ou Affectés d'un agent
app.get("/getAccAff/:id", (req, res) => {
    Ticket.find({ agent_id: req.params.id }, null, { sort: { date_affec_accep: 1 } }).populate({ path: "etudiant_id", populate: { path: "classe_id", populate: { path: "diplome_id" } } }).populate({ path: "etudiant_id", populate: { path: "ecole_id" } })?.populate({ path: "task_id", populate: { path: "project_id" } })//Et "En attente d'une réponse"
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })

})

//Update d'un ticket
app.post("/update/:id", (req, res) => {
    console.log("****************************")
    Ticket.findByIdAndUpdate(req.params.id,
        {
            ...req.body
        }, { new: true }, (err, ticket) => {
            if (err) {
                console.error(err)
                res.status(500).send(err)
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
            Ticket.find({ statut: "Queue d'entrée" }, null, { sort: { date_ajout: 1 } }).populate({ path: "etudiant_id", populate: { path: "classe_id" } })
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
            Ticket.find({ $or: [{ statut: "En cours de traitement" }, { statut: "En attente d'une réponse" }] }, null, { sort: { date_affec_accep: 1 } }).populate({ path: "etudiant_id", populate: { path: "classe_id" } })
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
            statut: "En attente de traitement",
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
                            from: 'ims@intedgroup.com',
                            to: userFromDb.email,
                            subject: '[IMS - Ticketing] - Notification',
                            html: html2,
                            attachments: [{
                                filename: 'signature.png',
                                path: 'assets/ims-intedgroup-logo.png',
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
                        from: 'ims@intedgroup.com',
                        to: userFromDb.email,
                        subject: '[IMS - Ticketing] - Notification ',
                        html: html3,
                        attachments: [{
                            filename: 'signature.png',
                            path: 'assets/ims-intedgroup-logo.png',
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
                        let html4 = '<p style="color:black"> Bonjour  ' + gender + userFromDb.lastname + ',</p><br><p style="color:black">Vous avez reçu un nouveau message pour le ticket N°<strong> ' + ticket.customid + '  </strong> avec le détail : <br><strong> ' + ticket.description + '</strong>.</p><br><p>Une réponse est attendue de votre part.</p> <p style="color:black"> Cordialement,</p> <img src="red"> ';
                        let mailOptions = {
                            from: 'ims@intedgroup.com',
                            to: userFromDb.email,
                            subject: '[IMS - Ticketing] - Notification',
                            html: html4,
                            attachments: [{
                                filename: 'signature.png',
                                path: 'assets/ims-intedgroup-logo.png',
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
                            from: 'ims@intedgroup.com',
                            to: userFromDb.email,
                            subject: '[IMS - Ticketing] - Notification',
                            html: html5,
                            attachments: [{
                                filename: 'signature.png',
                                path: 'assets/ims-intedgroup-logo.png',
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
    Ticket.find({ $or: [{ statut: "En cours de traitement" }, { statut: "En attente d'une réponse" }, { statut: "Traité" }] }, null, { sort: { statut: 1 } }).populate({ path: "etudiant_id", populate: { path: "classe_id" } }) //.populate({ path: 'sujet_id', populate: { path: "service_id" } }).populate("createur_id").populate({ path: "agent_id", populate: { path: "service_id" } })
        .then(result => {
            res.status(200).send(result.length > 0 ? result : [])
        })
        .catch(err => {
            console.error(err);
        })
})
//recuperation d'un ticket par 'identifiant d'un etudiant
app.get("/getByIdEtudiant/:id", (req, res) => {
    Ticket.findOne({ etudiant_id: req.params.id }).then((dataTicket) => {
        res.status(200).send({ dataTicket });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});



//Renvoie un ticket dans la queue d'entrée
app.post("/revertTicket/:id", (req, res) => {
    Ticket.findById(req.params.id).then((ticket) => {
        User.findOne({ _id: ticket.agent_id }).then((userFromDb) => {
            if (req.body.revertedByAdmin) {
                let gender = (userFromDb.civilite == 'Monsieur') ? 'M. ' : 'Mme ';
                let htmlemail = '<p style="color:black"> Bonjour  ' + gender + userFromDb.lastname + ',</p> </br> <p style="color:black"> Le ticket qui a pour numéro : <b> ' + ticket.customid + ' </strong> que vous gériez et qui a pour description <b>' + ticket.description + ' </strong>à été renvoyé dans la queue d\'entrée par un responsable</p></br><p style="color:black">Cordialement,</p> <img  src="red"/> '
                let mailOptions = {
                    from: 'ims@intedgroup.com',
                    to: userFromDb.email,
                    subject: '[IMS - Ticketing] - Notification ',
                    html: htmlemail,
                    attachments: [{
                        filename: 'signature.png',
                        path: 'assets/ims-intedgroup-logo.png',
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
                if (err) {
                    console.error(err);
                    res.status(404).send(err)
                }
                else
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
                    if (err) {
                        console.error(err);
                        res.status(404).send(err)
                    }
                    else
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
    Ticket.find({ createur_id: req.params.id, $or: [{ statut: "En cours de traitement" }, { statut: "En attente d'une réponse" }] })
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

app.get("/getAllAssigne/:id", (req, res) => {
    Ticket.find({ agent_id: req.params.id })
        .populate('createur_id').populate({ path: 'sujet_id', populate: { path: 'service_id' } }).populate('agent_id').populate('assigne_by')
        .then((ticket) => { res.status(200).send(ticket); })
        .catch((error) => { res.status(400).send(error); })
});

app.get("/getAllNonAssigne", (req, res) => {
    Ticket.find({ agent_id: null }).populate('createur_id').populate({ path: 'sujet_id', populate: { path: 'service_id' } }).populate('agent_id').populate('assigne_by')
        .then((ticket) => { res.status(200).send(ticket); })
        .catch((error) => { res.status(400).send(error); })
});

app.post("/getAllNonAssigneV2", (req, res) => {
    Ticket.find({ agent_id: null, service_id: { $in: req.body.service_list } }).populate('createur_id').populate({ path: 'sujet_id', populate: { path: 'service_id' } }).populate('agent_id').populate('assigne_by')
        .then((ticket) => { res.status(200).send(ticket); })
        .catch((error) => { res.status(400).send(error); })
});

app.post("/getAllAssigneV2", (req, res) => {
    Ticket.find({ agent_id: { $ne: null }, service_id: { $in: req.body.service_list } }).populate('createur_id').populate({ path: 'sujet_id', populate: { path: 'service_id' } }).populate('agent_id').populate('assigne_by')
        .then((ticket) => { res.status(200).send(ticket); })
        .catch((error) => { res.status(400).send(error); })
});

app.get("/getAllAssigneAdmin", (req, res) => {
    Ticket.find({ agent_id: { $ne: null } }).populate('createur_id').populate({ path: 'sujet_id', populate: { path: 'service_id' } }).populate('agent_id').populate('assigne_by')
        .then((ticket) => { res.status(200).send(ticket); })
        .catch((error) => { res.status(400).send(error); })
});

app.get("/getAllRefuse", (req, res) => {
    Ticket.find({ isReverted: true }).populate('createur_id').populate({ path: 'sujet_id', populate: { path: 'service_id' } }).populate('agent_id').populate('assigne_by').populate('user_revert')
        .then((ticket) => { res.status(200).send(ticket); })
        .catch((error) => { res.status(400).send(error); })
});

app.get("/getAllTraite", (req, res) => {
    Ticket.find({ statut: 'Traité' }).populate('createur_id').populate({ path: 'sujet_id', populate: { path: 'service_id' } }).populate('agent_id').populate('assigne_by')
        .then((ticket) => { res.status(200).send(ticket); })
        .catch((error) => { res.status(400).send(error); })
});

app.get("/getAllAttenteDeTraitement", (req, res) => {
    Ticket.find({ statut: { $ne: 'Traité' } }).populate('createur_id').populate({ path: 'sujet_id', populate: { path: 'service_id' } }).populate('agent_id').populate('assigne_by')
        .then((ticket) => { res.status(200).send(ticket); })
        .catch((error) => { res.status(400).send(error); })
});
//Récupérer tous les tickets d'un User
app.get("/getAllMine/:id", (req, res) => {
    Ticket.find({ createur_id: req.params.id }, null, { sort: { date_ajout: 1 } })
        .populate('createur_id').populate({ path: 'sujet_id', populate: { path: 'service_id' } }).populate('agent_id').populate('assigne_by')
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })
});

app.post('/getStats', (req, res) => {
    console.log(req.body)
    if (req.body.service_id && !req.body.sujet_id) {
        Sujet.find({ service_id: req.body.service_id }).then(data => {
            let temp = []
            data.forEach(val => { temp.push(val._id) })
            req.body.sujet_id = { $in: temp }
            delete req.body.service_id
            Ticket.find(req.body)
                .then((ticket) => { res.status(200).send(ticket); })
                .catch((error) => { res.status(400).send(error); })
        })
    } else {
        delete req.body.service_id
        Ticket.find(req.body)
            .then((ticket) => { res.status(200).send(ticket); })
            .catch((error) => { res.status(400).send(error); })
    }
})

const multer = require('multer');
const fs = require("fs")
var mime = require('mime-types')
const path = require('path');
const st = multer.diskStorage({
    destination: (req, file, callback) => {
        let storage = `storage/ticket/${req.body.ticket_id}/${req.body.document_id}`;

        if (!fs.existsSync(storage)) {
            fs.mkdirSync(storage, { recursive: true });
        }
        callback(null, storage);
    },
    filename: (req, file, callback) => {
        callback(null, `${file.originalname}`);
    }
});

const uploadConfig = multer({ storage: st });
app.post('/addFile', uploadConfig.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        const error = new Error('Aucun fichier choisis');
        error.httpStatusCode = 400;
        return next(error);
    }

    res.status(201).send({ message: "C'est bon" });
})

const st2 = multer.diskStorage({
    destination: (req, file, callback) => {
        let storage = `storage/ticket/service/${req.body.ticket_id}/${req.body.document_id}`;

        if (!fs.existsSync(storage)) {
            fs.mkdirSync(storage, { recursive: true });
        }
        callback(null, storage);
    },
    filename: (req, file, callback) => {
        callback(null, `${file.originalname}`);
    }
});

const uploadConfig2 = multer({ storage: st2 });
app.post('/addFileService', uploadConfig2.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        const error = new Error('Aucun fichier choisis');
        error.httpStatusCode = 400;
        return next(error);
    }

    res.status(201).send({ message: "C'est bon" });
})

app.get("/downloadFile/:_id/:file_id/:name", (req, res, next) => {
    let pathFile = `storage/ticket/${req.params._id}/${req.params.file_id}/${req.params.name}`;
    let file = fs.readFileSync(pathFile, { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    res.status(200).send({ file: file, documentType: mime.contentType(path.extname(pathFile)) })
});

app.get("/downloadFileService/:_id/:file_id/:name", (req, res, next) => {
    let pathFile = `storage/ticket/service/${req.params._id}/${req.params.file_id}/${req.params.name}`;
    let file = fs.readFileSync(pathFile, { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    res.status(200).send({ file: file, documentType: mime.contentType(path.extname(pathFile)) })
});

const stF = multer.diskStorage({
    destination: (req, file, callback) => {
        let storage = `storage/ticket/${req.body.ticket_id}/${req.body.document_id}`;

        if (!fs.existsSync(storage)) {
            fs.mkdirSync(storage, { recursive: true });
        }
        callback(null, storage);
    },
    filename: (req, file, callback) => {
        callback(null, `${file.originalname}`);
    }
});

const upF = multer({ storage: stF });
app.post("/uploadFile", upF.single('file'), (req, res, next) => {
    const file = req.file;

    if (!file) {
        const error = new Error('Aucun fichier choisis');
        error.httpStatusCode = 400;
        return next(error);
    }

    res.status(201).send({ message: "C'est bon" });
});

const stFS = multer.diskStorage({
    destination: (req, file, callback) => {
        let storage = `storage/ticket/service/${req.body.ticket_id}/${req.body.document_id}`;

        if (!fs.existsSync(storage)) {
            fs.mkdirSync(storage, { recursive: true });
        }
        callback(null, storage);
    },
    filename: (req, file, callback) => {
        callback(null, `${file.originalname}`);
    }
});

const upFS = multer({ storage: stFS });
app.post("/uploadFileService", upFS.single('file'), (req, res, next) => {
    const file = req.file;

    if (!file) {
        const error = new Error('Aucun fichier choisis');
        error.httpStatusCode = 400;
        return next(error);
    }

    res.status(201).send({ message: "C'est bon" });
});
app.post('/sendMailAff', (req, res) => {
    let htmlemail = `
    <p>Bonjour</p><br>
    <p>Nous souhaitons vous notifier qu'un nouveau ticket vous a été assigné pour le service ${req.body.service}. Le sujet du ticket est ${req.body.sujet}. Il vous a été assigné le ${req.body.date}.</p><br>
    <p>Nous vous invitons à prendre en charge ce ticket dès que possible. Assurez-vous de bien comprendre la nature de la demande, de collecter toutes les informations nécessaires et de suivre les procédures internes pour résoudre le problème ou fournir l'assistance requise.</p><br>
    <p>Cordialement,</p>
    <img src="red"/>
    `
    let mailOptions = {
        from: 'ims@intedgroup.com',
        to: req.body.agent_email,
        subject: '[IMS - Ticketing] - Assignation d\'un ticket ',
        html: htmlemail,
        attachments: [{
            filename: 'signature.png',
            path: 'assets/ims-intedgroup-logo.png',
            cid: 'red' //same cid value as in the html img src
        }]
    };


    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        }
    });
})

app.post('/sendMailRefus', (req, res) => {
    User.find({ roles_list: { $elemMatch: { module: 'Ticketing', role: 'Super-Admin' } } }).then(users => {
        console.log(users)
        let emailList = []
        users.forEach(u => {
            emailList.push(u.email)
        })
        let htmlemail = `
        <p>Bonjour,</p><br>
    
        <p>Nous tenons à vous informer que l'agent ${req.body.agent_name} a refusé le ticket pour le motif suivant : ${req.body.motif}.</p><br>
        
        
        <p>Cordialement,</p><br>
        <img src="red"/>
        `
        let mailOptions = {
            from: 'ims@intedgroup.com',
            to: emailList,
            subject: '[IMS - Ticketing] - Refus d\'un ticket ',
            html: htmlemail,
            attachments: [{
                filename: 'signature.png',
                path: 'assets/ims-intedgroup-logo.png',
                cid: 'red' //same cid value as in the html img src
            }]
        };


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            }
            res.send(emailList)
        });
    })

})

app.post('/sendMailUpdateStatut', (req, res) => {
    User.find({ roles_list: { $elemMatch: { module: 'Ticketing', role: 'Super-Admin' } } }).then(users => {
        console.log(users)
        let emailList = [req.body.createur_email]
        users.forEach(u => {
            emailList.push(u.email)
        })
        let htmlemail = `
        <p>Bonjour,</p><br>
        
        <p>Nous tenons à vous informer que le ticket ${req.body.id} a changé de statut. L'état actuel du ticket est ${req.body.statut}.</p><br>
        
        
        <p>Cordialement</p><br>
        `
        let mailOptions = {
            from: 'ims@intedgroup.com',
            to: emailList,
            subject: '[IMS - Ticketing] - Changement de statut d\'un ticket ',
            html: htmlemail,
            attachments: [{
                filename: 'signature.png',
                path: 'assets/ims-intedgroup-logo.png',
                cid: 'red' //same cid value as in the html img src
            }]
        };


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            }
            res.send(emailList)
        });
    })

})

app.get('/getAllByServiceAndCreateurID/:service_id/:createur_id', (req, res) => {
    let id = req.params.service_id
    let listSujetofService = []
    let TicketList = []
    Sujet.find()
        .then(listSujets => {
            listSujets.forEach(sujet => {
                if (sujet.service_id == id) {
                    listSujetofService.push(sujet._id.toString())
                }
            });
            Ticket.find({ createur_id: req.params.createur_id }, null, { sort: { date_ajout: 1 } }).populate('createur_id').populate({ path: 'sujet_id', populate: { path: 'service_id' } })
                .then(result => {
                    let listTicket = result.length > 0 ? result : []
                    listTicket.forEach(ticket => {
                        if (listSujetofService.includes(ticket.sujet_id._id.toString())) {
                            TicketList.push(ticket)
                        }
                    })
                    res.status(200).send(TicketList)
                })
                .catch(err => {
                    console.error(err);
                })
        })
        .catch(err => {
            console.error(err);
        })
})


module.exports = app;
