const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { User } = require("./../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');


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




//service registre
app.post("/registre", (req, res) => {
    
    let data = req.body;
    console.log(data)
    let user = new User({
        civilite: data.civilite,
        firstname: data.firstname,
        lastname: data.lastname,
        phone: data.phone,
        adresse:data.adresse,
        email: data.email,
        password: data.password,
        role : data.role || "user",
        service_id : data?.service_id || null
    })
    user.save().then((userFromDb) => {
        res.status(200).send(userFromDb);

        let htmlmail='<p>Bonjour '+userFromDb.lastname+' '+userFromDb.firstname+', </p><h3 style="color:orange">Felicitation !</h3><p style="color:black"> Votre compte E-Ticketing a été crée avec succés</p><p>Cordialement,</p><footer> <img  src="red"/></footer>';
        let mailOptions = {
            from: 'estya-ticketing@estya.com',
            to: data.email,
            subject: 'Estya-Ticketing',
            html:htmlmail,
            attachments: [{
                filename: 'signature.png',
                path: 'assets/signature.png',
                cid: 'red' //same cid value as in the html img src
            }]
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
               console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        
    }).catch((error) => {
        res.status(400).send(error);
    })
});
//service login
app.post("/login", (req, res) => {
    let data = req.body;
    User.findOne({ email: data.email, password: data.password }).then((userFromDb) => {
        if (!userFromDb) {
            res.status(404).send({ message: data });
        }
        else {
            let token = jwt.sign({ id: userFromDb._id, role: userFromDb.role ,service_id:userFromDb.service_id }, "mykey")
            //on est entrain d'envoyer le token dans response donc dans le headers du coup dans le body on reçoit le msg logged
            //res.set('token',token);
            //res.status(200).send({message:"user logged"});
            //on envoie dans le body le token
            res.status(200).send({ token });
        }
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});
app.get("/getById/:id", (req, res) => {
    let id = req.params.id;
    User.findOne({ _id: id }).then((userFromDb) => {
        let userToken = jwt.sign({userFromDb},"userData")
        res.status(200).send({ userToken });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});
app.get("/getAll",(req,res)=>{
    User.find()
    .then(result=>{
        res.send(result.length>0?result:[]);
    })
    .catch(err=>{
        console.log(err);
    })
});


app.post("/updateById/:id", (req, res) => {
    User.findOneAndUpdate({_id:req.params.id},
        {
            civilite:req.body.civilite,
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            phone:req.body.phone,
            role:req.body.role,
            adresse:req.body.adresse,
            service_id:req.body.service_id

        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            res.send(user)
        })
})
app.get("/getAllbyService/:id",(req,res)=>{
    User.find({service:req.params.id})
    .then(result=>{
        //console.log('result: ',result)
        res.send(result.length>0?result:[]);
    })
    .catch(err=>{
        console.log(err);
    })
});
app.get("/getAllAgent/",(req,res)=>{
    User.find({role:["Responsable","Agent","Admin"] })

    .then(result=>{
        //console.log('result: ',result)
        res.send(result.length>0?result:[]);
    })
    .catch(err=>{
        console.log(err);
    })
})
module.exports = app;
