const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express(); //à travers ça je peux faire la creation des services
const nodemailer = require('nodemailer');
app.disable("x-powered-by");



// initialiser le transporter 

let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: "ims@intedgroup.com",
        pass: "InTeDGROUP@@0908",
    },
});

app.post("/sendMail", (req, res) => {
    let messageObject = req.body;

    //  res.send(info);
    let htmlmail = `<p style="font-size:20px; color:black">Bonjour,</p>
                    <p style="font-size:20px; color:black">${messageObject.civilite} ${messageObject.name} a effectué une demande renseignements.</p>
                    <p style="font-size:20px; color:black"> Voici son message :</p>
                    <p style="font-size:20px; color:black">${messageObject.des}</p>
                    <p style="font-size:20px; color:black"> Merci de le contacter à l'adresse ${messageObject.mail}</p>
                    <p>   </p>
                    <p style="font-size:20px;"> Bien à vous</p>
                    
                    <footer> <img src="cid:red"/></footer>`

    let mailOptions = {
        from: "ims@intedgroup.com",
        to: "ims.support@intedgroup.com",
        subject: 'Demande de renseignements',
        html: htmlmail,
        attachments: [{
            filename: 'logo.png',
            path: 'assets/logo.png',
            cid: 'red' //same cid value as in the html img src
        }]

    };

    let htmlmailUser = `<p style="font-size:20px; color:black">Bonjour ${messageObject.civilite} ${messageObject.name},</p>
                    <p>   </p>
                    <p style="font-size:20px; color:black">Vous avez effecuté une demande de renseignements auprès de nos services.</p>
                    <p style="font-size:20px; color:black"> Nous vous remercions pour l'interêt que vous portez à INTED Groupe.</p>
                    <p style="font-size:20px; color:black"> Voici votre demande :</p>
                    <p style="font-size:20px; color:black"> ${messageObject.des} </p>
                    <p style="font-size:20px; color:black"> Nous vous répondrons dans les plus bref délais.</p>
                    <p>   </p>
                    <p style="font-size:20px;"> Bien à vous</p>
                    
                    <footer> <img src="cid:red"/></footer>`

    let mailOptionsUser = {
        from: "ims@intedgroup.com",
        to: `${messageObject.mail}`,
        subject: 'Demande de renseignements prise en compte',
        html: htmlmailUser,
        attachments: [{
            filename: 'logo.png',
            path: 'assets/logo.png',
            cid: 'red' //same cid value as in the html img src
        }]
    };
    transporter.sendMail(mailOptionsUser, function (error, info) {
        if (error) {
            console.error(error);
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            }
            res.send({ msg: "YEAH" })
        });
    });



});
module.exports = app;