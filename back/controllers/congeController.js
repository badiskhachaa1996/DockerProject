const express = require('express');
const app = express();
app.disable("x-powered-by");
const { Conge } = require('./../models/Conge');
const { User } = require("./../models/user");

// méthode de demande de congés
app.post("/post-conge", (req, res) => {
    const conge = new Conge({ ...req.body });
    //Enregistrement du congé dans la base de données
    conge.save()
        .then((response) => { res.status(201).send(response); })
        .catch((error) => { res.status(500).send("Impossible de prendre en compte votre demande de congés"); })
})


// recuperation de la liste des conges d'un utilisateur 
app.get("/get-conges-user-id/:user_id",(req, res) => {
    const { user_id } = req.params; 

    Conge.find({ user_id: user_id })
    .then((response) => {res.status(200).send(response) } )
    .catch((error) => { res.status(400).send(error)})
})


//mise à jour d'un object conge 
app.put("/put-conge",(req,res) =>{
    const conge = new Conge({ ...req.body });

    Conge.updateOne({ _id: conge._id }, { ...req.body })
    .then((response) => {res.status(201).send(response) } )
    .catch((error) => { res.status(400).send(error)})
})


//mise-a-jour du statut
app.patch("/answer", (req,res) =>{
    const {answer}= req.body;
    const {id}= req.body;

    Conge.findOneAndUpdate({ _id: id}, {statut: answer })
    .then((response) => {res.status(201).send(response) } )
    .catch((error) => { res.status(400).send(error)})
    
})


//supression d'une demmande de conge
app.delete("/delete-conge", (req,res) =>{
    const {id}= req.body;
    
    Conge.deleteOne({ _id: id })
    .then((response) => {res.status(201).send(response) } )
    .catch((error) => { res.status(400).send(error)})
})


module.exports = app;