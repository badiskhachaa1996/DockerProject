const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { Message } = require("./../models/Message");
const fs = require("fs")

//Création d'un nouveau message TODO
app.post("/create", (req, res) => {
    if (req.body.file && req.body.file!=null && req.body.file!=''){
        fs.mkdir("./storage/" + req.body.ticket_id + "/",
            { recursive: true }, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        fs.writeFile("storage/" + req.body.ticket_id + "/" + req.body.file.filename, req.body.file.value, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    const message = new Message({
        user_id: req.body.id,
        description: req.body.description,
        document: req.body?.file?.filename,
        ticket_id: req.body.ticket_id,
        documentType: req.body?.file?.type,
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
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.log(err);
        })
});
//Récuperer tous les messages d'un ticket
app.get("/getAllByTicketID/:id", (req, res) => {
    Message.find({ ticket_id: req.params.id })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.log(err);
        })
});

//Récupérer tous les messages par TicketID
app.get("/getAllDic", (req, res) => {
    let dic = {}
    Message.find()
        .then(result => {
            result.forEach(msg => {
                dic[msg.ticket_id] = []
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

//Récupérer en base 64 le fichier TOD0
app.get("/downloadFile/:id", (req, res) => {
    Message.findOne({ _id: req.params.id }).then((data) => {
        let filename = data.document
        let file = fs.readFileSync("storage/" + data.ticket_id + "/" + filename, { encoding: 'base64' }, (err) => {
            if (err) {
                return console.error(err);
            }
        });
        res.status(200).send({ file: file, documentType: data.documentType })
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});
module.exports = app;