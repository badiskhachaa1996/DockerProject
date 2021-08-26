const express = require("express");
const { Message } = require("../models/Message");
const app = express(); //à travers ça je peux faire la creation des services
const { Ticket } = require("./../models/Ticket");

//Création d'un nouveau ticket
app.post("/create",(req, res) => {
    const ticket = new Ticket({
        createur_id:req.body.id,
        sujet_id:req.body.sujet_id
    });

    ticket.save((err, doc) => {
        console.log(doc)
        console.log(err)
        const message = new Message({
            user_id:req.body.id,
            description:req.body.description,
            document:req.body?.document,
            ticket_id:doc.id
        });
        message.save((err,doc)=>{
            res.send({message: "Votre ticket a été crée!"});
        })
    });
});


//Suppression d'un ticket
app.get("/deleteById/:id",(req, res) => {
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
            sujet_id:req.body.sujet_id,
            agent_id:req.body.agent_id,
            statut :req.body.statut,
            date_affec_accep:req.body.date_affec_accep,
            temp_traitement:req.body.temp_traitement,
            temp_fin:req.body.temp_fin,
            isAffected:req.body.isAffected,
        }, {new: true}, (err, user) => {
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
app.get("/getAll",(req, res) => {
    Ticket.find()
        .then(result=>{
            console.log('result: ',result)
            res.send(result.length>0?result:'No Tickets');
        })
        .catch(err=>{
            console.log(err);
        })
});

//Récupérer tous les tickets d'un User
app.get("/getAllbyUser/:id",(req, res) => {
    Ticket.find({ createur_id: req.params.id })
        .then(result=>{
            console.log('result: ',result)
            res.send(result.length>0?result:'No Tickets');
        })
        .catch(err=>{
            console.log(err);
        })
});
//Récupérer le premier message d'un Ticket
app.get("/getFirstMessage/:id",(req,res)=>{
    Message.findOne({ticket_id:req.params.id}).sort({date_ajout:1}).then((dataMessage) => {
        res.status(200).send({ dataMessage });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })

})
module.exports = app;
