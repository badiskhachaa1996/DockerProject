const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { Message } = require("./../models/Message");
const fs = require("fs")
const { User } = require("./../models/User");
const { Ticket } = require("./../models/Ticket");
const nodemailer = require('nodemailer');

//creation d'un transporter smtp
let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'estya-ticketing@estya.com',
        pass: 'ESTYA@@2021',
    },
});




//Création d'un nouveau message 
app.post("/create", (req, res) => {
    //Sauvegarde du fichier si il y en a un
    if (req.body.file && req.body.file != null && req.body.file != '') {
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
    //Sauvegarde du message
    const message = new Message({
        user_id: req.body.id,
        description: req.body.description,
        document: req.body?.file?.filename,
        ticket_id: req.body.ticket_id,
        documentType: req.body?.file?.type,
        date_ajout: Date.now(),
        isRep: req.body.isRep,

    });

    message.save((err, msg) => {
        res.send({ message: "Votre message a été crée!", doc: msg });
        Ticket.findOne({ _id: msg.ticket_id }).then((tickFromDb) => {
            User.findOne({ _id: tickFromDb.agent_id }).then((userFromDb) => {
                if (msg.isRep) {
                    //Envoie du mail, pour avertir d'un nouveau message sur son ticket
                    let htmlemail = '<p style="color:black"> Bonjour  '+(user.civilite=='Monsieur')?'M. ':'Mme ' + userFromDb.lastname + ',</p> </br> <p style="color:black"> Vous avez reçu un nouveau message pour le ticket qui a pour numéro : <b> ' + tickFromDb.id + ' </b> et qui a pour sujet <b>' + tickFromDb.description + ' </b></br><p style="color:black">Cordialement,</p> <img  src="red"/> '
                    let mailOptions = {
                        from: 'estya-ticketing@estya.com',
                        to: userFromDb.email,
                        subject: '[ESTYA Ticketing] - Notification ',
                        html: htmlemail,
                        attachments: [{
                            filename: 'signature.png',
                            path: 'assets/signature.png',
                            cid: 'red'
                        }]
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        }else{
                            //console.log("Email envoyé\nà "+userFromDb.email+"\nRaison:Nouveau Message")
                        }
                    });
                }
            }).catch((error) => {
                res.status(404).send("erreur :" + error);
            });
        }).catch((error) => {
            res.status(404).send("erreur :" + error);
        });
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

//Récuperer un message par ID

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

//Récupérer un dictionnaire en format dic[ticket_id]=[messages]
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

//Récupérer en base 64 le fichier d'une message
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