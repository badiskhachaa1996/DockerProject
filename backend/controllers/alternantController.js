const express = require('express');
const { Entreprise } = require('../models/entreprise');
const app = express();
const { Alternant } = require('./../models/alternant');
const { User } = require('./../models/user');

//Creation d'un nouvel alternant
app.post("/create", (req, res, next) => {
    //creation du nouvel alternant
    let alternantData = req.body.newAlternant;
    let alternant = new Alternant(
        {
            user_id: alternantData.user_id,
            role: alternantData.role,
            classe_id: alternantData.classe_id,
            statut: alternantData.statut,
            nationalite: alternantData.nationalite,
            date_de_naissance: alternantData.date_de_naissance,
            entreprise_id: alternantData.entreprise_id
        });

    //Creation du nouveau user
    let userData = req.body.newUser;
    let user = new User(
        {
            civilite: userData.civilite,
            firstname: userData.firstname,
            lastname: userData.lastname,
            phone: userData.phone,
            email: userData.email,
            //password: bcrypt.hashSync(userData.password, 8),
            role: userData.role,
            service_id: userData.service_id,
            type: userData.type,
            entreprise: userData.entreprise,
            pays_adresse: userData.pays_adresse,
            ville_adresse: userData.ville_adresse,
            rue_adresse: userData.rue_adresse,
            numero_adresse: userData.numero_adresse,
            postal_adresse: userData.postal_adresse
        });

    //Verification de l'existence de l'Utilisateur
    User.findOne({ email: userData.email })
        .then((userFromDb) => {
            if (userFromDb) {
                Alternant.findOne({ user_id: userFromDb._id })
                    .then((alternantFromDb) => {
                        if (alternantFromDb) {
                            res.status(201).json({ error: 'Cet alternant existe déja' });
                        } else {
                            alternant.user_id = userFromDb._id;
                            alternant.save()
                                .then((alternantFromDb) => { res.status(201).json({ success: "Alternant ajouté dans la BD!" }) })
                                .catch((error) => { res.status(400).json({ error: "Impossible d'ajouter ce alternant " + error.message }) });

                        }
                    })
                    .catch((error) => { res.status(400).json({ error: "Impossible de verifier l'existence de l'alternant" }) });
            }
            else {
                user.save()
                    .then((userCreated) => {
                        alternant.user_id = userCreated._id;
                        alternant.save()
                            .then((alternantCreated) => { res.status(201).json({ success: 'Alternant crée' }) })
                            .catch((error) => {  console.log(alternant); });
                    })
                    .catch((error) => { res.status(400).json({ error: 'Impossible de créer un nouvel utilisateur ' + error.message }) });
            }
        })
        .catch((error) => { res.status(500).json({ error: 'Impossible de verifier l\'existence de l\'utilisateur ' }) });
});

//Recupere la liste de tout les alternants
app.get("/getAll", (req, res, next) => {
    Alternant.find()
        .then((alternantsFromDB) => { res.status(200).send(alternantsFromDB); })
        .catch((err) => { res.status(500).send("Impossible de recuperer la liste des alternants"); });
});


//Recupere un alternant via son identifiant
app.get("/getById/:id", (req, res, next) => {
    Alternant.findOne({ _id: req.params.id })
        .then((alternantFromDB) => { res.status(200).send(alternantFromDB); })
        .catch((err) => { res.status(500).send("Impossible de recuperer cet alternant"); });
});

//Mettre à jour un alternant via son identifiant
app.put("/update", (req, res, next) => {
    Alternant.findOneAndUpdate({ _id: req.body._id },
        {
            user_id: req.body.user_id,
            role: req.body.role,
            classe_id: req.body.classe_id,
            statut: req.body.statut,
            nationalite: req.body.nationalite,
            date_de_naissance: req.body.date_de_naissance,
            entreprise_id: req.body.entreprise_id
        })
        .then((alternantUpdated) => { res.status(201).send(alternantUpdated); })
        .catch((error) => { res.status(400).send('Impossible de mettre à jour cet alternant') });
});

//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;