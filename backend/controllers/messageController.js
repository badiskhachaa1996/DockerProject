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
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'estya-ticketing@estya.com',
        pass: 'ESTYA@@2021',
    },
});




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
        date_ajout: Date.now(),
        isRep: req.body.isRep,

    });
    

    message.save((err, msg) => {
       
        let createur_id;
    Ticket.findOne({ _id: msg.ticket_id }).then((tickFromDb) => {
        createur_id = tickFromDb.createur_id
        console.log("createur du ticket : "+ createur_id)

        

        let UserDB;
        User.findOne({ _id: tickFromDb.agent_id }).then((userFromDb) => {
            UserDB = userFromDb
            console.log("createur du ticket : "+ createur_id)
            console.log("agent du ticket : "+ UserDB._id)
        
            if (msg.isRep) {
            let htmlemail = '<h3 style="color:red"> Notification ! </3> <p style="color:black"> Bonjour ' + UserDB.lastname +' '+UserDB.firstname +', </p> </br> <p>  une reponse a été publié pour le ticket' +msg.ticket_id +' </p></br></br><p style="color:black">Cordialement,</p> <img  src="red"/> '
            let mailOptions = {
                from: 'estya-ticketing@estya.com',
                to:userFromDb.email,
                subject: 'Notification E-Ticketing',
                html: htmlemail,
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
                    res.send({ message: "Votre message a été crée!", doc: msg });
                }
            });
        }
        else{
            res.send({ message: "Votre message a été crée!", doc: msg });
        }

        }).catch((error) => {
            res.status(404).send("erreur :" + error);
        })
    
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