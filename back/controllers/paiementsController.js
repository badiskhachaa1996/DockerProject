const express = require("express");
const app = express();
const { Paiements } = require("./../models/paiements");
const { User } = require("../models/user");


//Récuperer un justificatif de paiement par Id:
app.post("/getById/:id", (req, res) => {
    Presence.findOne({ _id: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send(error);
    })
});


//Récuperer tous les justificatifs de paiements:
app.get("/getAll", (req, res) => {
    Presence.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })
});

//Récupérer tous les paiements d'un user par id_user
app.get("/getAllByUser/:id", (req, res) => {
    Presence.find({ user_id: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send(error);
    })
});

//Création d'un paiement 
app.post("/create", (req, res) => {

    let data = req.body;
    let paiement = new Paiements({
        inscriptionId: data.inscriptionId,
        typePaiement: data.typePaiement,
        nomDonneurDordre: data.nomDonneurDordre,
        numVirement: data.numVirement,
        datePaiement: data.datePaiement,
        paysVirement: data.paysVirement,
        montantVirement: data.montantVirement,
        remarque: data.remarque,
    })
    paiement.save().then((paiementFromDb)=>{
        res.status(200).send(paiementFromDb);
    }).catch((error)=>{
        res.status(400).send(error)
    })
});

module.exports = app;