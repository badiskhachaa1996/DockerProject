const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { Message } = require("./../models/Message");
const fs = require("fs")

//Création d'un nouveau message TODO
app.post("/create", (req, res) => {
    if(req.body.file.value){
        fs.mkdir("storage/"+ticket_id)
        fs.writeFile("storage/"+ticket_id+"/"+req.body.file.filename, req.body.file.value, 'base64', function(err) {
            console.log(err);
          });
    }
    const message = new Message({
        user_id: req.body.id,
        description: req.body.description,
        document: req.body?.filename,
        ticket_id: req.body.ticket_id,
        date_ajout: Date.now()
    });

    message.save((err, user) => {
        res.send({ message: "Votre message a été crée!", doc: user });
    });
});


//Suppression d'un message
app.get("/deleteById/:id", (req, res) => {
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
            description: req.body.description,
            document: req.body?.document
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            res.send(user)
        })
});

//Récuperer un message

app.get("/getById/:id", (req, res) => {
    Message.findOne({ _id: req.params.id }).then((data) => {
        res.status(200).send({ data });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});

//Récuperer tous les messages
app.get("/getAll", (req, res) => {
    Message.find()
        .then(result => {
            res.send(result.length > 0 ? result : { message: "Pas de Messages" });
        })
        .catch(err => {
            console.log(err);
        })
});
//Récuperer tous les messages d'un ticket
app.get("/getAllByTicketID/:id", (req, res) => {
    Message.find({ ticket_id: req.params.id })
        .then(result => {
            res.send(result.length > 0 ? result : { message: "Pas de Messages" });
        })
        .catch(err => {
            console.log(err);
        })
});

//Récupérer tous les messages par TicketID
app.get("/getAllDic", (req, res) => {
    let dic={}
    Message.find()
        .then(result => {
            result.forEach(msg => {
                dic[msg.ticket_id]=[]
            });
            result.forEach(msg => {
                dic[msg.ticket_id].push(msg)
            });
            res.status(200).send(dic)
        })
        .catch(err => {
            console.log(err);
        })
});
module.exports = app;