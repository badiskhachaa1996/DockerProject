const express = require('express');
const app = express();
app.disable("x-powered-by");
const { Entreprise } = require('./../models/entreprise');

//Recupère la liste des entreprises
app.get("/getAll", (req, res, next) => {
    Entreprise.find()
        .then((entreprisesFromDb) => { res.status(200).send(entreprisesFromDb); })
        .catch((error) => { req.status(500).json({ error: "Impossible de recuperer la liste des entreprises " + error.message }); });
});

//creation d'une nouvelle entreprise
app.post("/create", (req, res, next) => {
    delete req.body._id;
    let entreprise = new Entreprise(
        {
            ...req.body
        });

    //Création d'une nouvelle entreprise
    entreprise.save()
        .then((entrepriseSaved) => { 
            console.log(entrepriseSaved)
            res.status(201).send(entrepriseSaved); })
        .catch((error) => { res.status(400).json({ error: "Impossible d'ajouter une nouvelle entreprise " + error.message }); })

});


//Recuperation d'une entreprise selon un id
app.get("/getById/:id", (req, res, next) => {
    Entreprise.findOne({ _id: req.params.id })
        .then((entrepriseFormDb) => { res.status(200).send(entrepriseFormDb); })
        .catch((error) => { res.status(500).json({ error: "Impossible de recuperer cette entreprise" }) })
});


//Modification d'une entreprise
app.put("/update", (req, res, next) => {

    Entreprise.findOneAndUpdate({ _id: req.body._id },
        {
            r_sociale: req.body.r_sociale,
            fm_juridique: req.body.fm_juridique,
            vip: req.body.vip,
            type_ent: req.body.type_ent,
            isInterne: req.body.isInterne,
            siret: req.body.siret,
            code_ape_naf: req.body.code_ape_naf,
            num_tva: req.body.num_tva,
            nom_contact: req.body.nom_contact,
            prenom_contact: req.body.prenom_contact,
            fc_contact: req.body.fc_contact,
            email_contact: req.body.email_contact,
            phone_contact: req.body.phone_contact,
            nom_contact_2nd: req.body.nom_contact_2nd,
            prenom_contact_2nd: req.body.prenom_contact_2nd,
            fc_contact_2nd: req.body.fc_contact_2nd,
            email_contact_2nd: req.body.email_contact_2nd,
            phone_contact_2nd: req.body.phone_contact_2nd,
            pays_adresse: req.body.pays_adresse,
            ville_adresse: req.body.ville_adresse,
            rue_adresse: req.body.rue_adresse,
            numero_adresse: req.body.numero_adresse,
            postal_adresse: req.body.postal_adresse,
            email: req.body.email,
            phone: req.body.phone,
            website: req.body.website,
            financeur: req.body.financeur
        })
        .then((entrepriseUpdated) => { res.status(201).send(entrepriseUpdated); })
        .catch((error) => { res.status(400).send("Impossible de modifier cette entreprise"); });

});


//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;
