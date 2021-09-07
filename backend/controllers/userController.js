const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { User } = require("./../models/User");
const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'babacislimane@gmail.com', 
        pass: '16janvier2020', 
    },
});







//service registre
app.post("/registre", (req, res) => {
    
    let data = req.body;
    let user = new User({
        firstname: data.firstname,
        lastname: data.lastname,
        phone: data.phone,
        adresse:data.adresse,
        email: data.email,
        password: data.password,
        role : data.role || "user",
        service_id : data.service_id || "61279209649616413cda8a3d"
    })
    user.save().then((userFromDb) => {

        let mailOptions = {
            from: 'babacislimane@gmail.com',
            to: data.email,
            subject: 'Estya-Ticketing',
            text: 'Felicitation ! Votre compte E-Ticketing a été crée avec succés'
        };
        res.status(200).send({ message: "registration done" });

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
        res.send(result.length>0?result:{message:"Pas de Users"});
    })
    .catch(err=>{
        console.log(err);
    })
});


app.post("/updateById/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id,
        {   
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            phone:req.body.phone,
            password:req.body.password,
            role:req.body.role,
            adresse:req.body.adresse,
            service_id:req.body.service_id

        }, {new: true}, (err, user) => {
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
        res.send(result.length>0?result:{message:"Pas de Users"});
    })
    .catch(err=>{
        console.log(err);
    })
});
app.get("/getAllAgent/",(req,res)=>{
    User.find({role:["responsable","agent","admin"] })

    .then(result=>{
        //console.log('result: ',result)
        res.send(result.length>0?result:{message:"Pas de Users"});
    })
    .catch(err=>{
        console.log(err);
    })
})
module.exports = app;
