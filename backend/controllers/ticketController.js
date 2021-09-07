const express = require("express");
const mongoose = require("mongoose")
const Sujet = mongoose.model('sujet')
const app = express(); //à travers ça je peux faire la creation des services
const { Ticket } = require("./../models/Ticket");


//Création d'un nouveau ticket
app.post("/create", (req, res) => {
    const ticket = new Ticket({
        createur_id: req.body.id,
        sujet_id: req.body.sujet_id,
        description:req.body.description,
        date_ajout:Date.now()
    });

    ticket.save((err, doc) => {
        res.send({ message: "Votre ticket a été crée!",doc });
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
            description:req.body?.description

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
    Ticket.find({ createur_id: req.params.id })
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
    Ticket.find({ statut: "Queue d'entrée" })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.log(err);
        })

})

//Récupérer les Tickets Acceptes ou Affectés
app.get("/getAccAff/:id", (req, res) => {
    Ticket.find({ agent_id: req.params.id })//Et "En attente d'une réponse"
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
            description:req.body.description
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            res.send(user)
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
            Ticket.find({$or:[{ statut: "En cours de traitement"},{statut:"En attente d'une réponse"}] })
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
    let listSujetofService = []
    let TicketList = []
    Sujet.find()
        .then(listSujets => {
            listSujets.forEach(sujet => {
                if (sujet.service_id == id) {
                    listSujetofService.push(sujet._id.toString())
                }
            });
            Ticket.find({ statut: "Queue d'entrée" })
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
            Ticket.find({$or:[{ statut: "En cours de traitement"},{statut:"En attente d'une réponse"}] })
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
                res.status(200).send(user)
            }

        })
});

app.post("/changeService/:id", (req, res) => {
    Ticket.findByIdAndUpdate(req.params.id,
        {
            sujet_id: req.body.sujet_id
        },
        { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            } else {
                res.status(200).send(user)
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
                res.status(200).send(user)
            }

        })
});

/*app.post("/storeDoc", (req, res) => {
    require("fs").writeFile(req.body.filename, req.body.value, 'base64', function(err) {
        console.log(err);
      });
});*/
module.exports = app;
