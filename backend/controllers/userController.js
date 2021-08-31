const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { User } = require("./../models/User");
const jwt = require("jsonwebtoken");
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
        role : data.role,
        service_id : data.service_id
    })
    user.save().then((userFromDb) => {
        res.status(200).send({ message: "registration done" });
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
        //console.log('result: ',result)
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
})
module.exports = app;
