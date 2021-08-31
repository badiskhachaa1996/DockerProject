const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { Message } = require("./../models/Message");

//Création d'un nouveau message TODO
app.post("/create",(req, res) => {
    const message = new Message({
        user_id:req.body.id,
        description:req.body.description,
        document:req.body?.document
    });

    message.save((err, user) => {
        res.send({message: "Votre message a été crée!"});
    });
});


//Suppression d'un message
app.get("/deleteById/:id",(req, res) => {
    Message.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.send(err)
        }
        res.send(user)
    })
});

//Modification d'un message
app.post("/updateById/:id", (req, res) => {
    Message.findByIdAndUpdate(req.params.id,
        {
            description:req.body.description,
            document:req.body?.document
        }, {new: true}, (err, user) => {
            if (err) {
                res.send(err)
            }
            res.send(user)
        })
});

//Récuperer un message

app.get("/getById/:id", (req, res) => {
    Message.findOne({ _id: req.params.id }).then((dataTicket) => {
        res.status(200).send({ dataTicket });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});
//Récuperer tous les messages
app.get("/getAll",(req, res) => {
    Message.find()
        .then(result=>{
            console.log('result: ',result)
            res.send(result.length>0?result:{message:"Pas de Messages"});
        })
        .catch(err=>{
            console.log(err);
        })
});
module.exports = app;