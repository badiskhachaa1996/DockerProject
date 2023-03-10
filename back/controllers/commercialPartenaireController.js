const express = require('express');
const app = express();
app.disable("x-powered-by");
const { CommercialPartenaire } = require('../models/CommercialPartenaire');
const { User } = require('../models/user');
const { Prospect } = require("../models/prospect");
const bcrypt = require("bcryptjs");

//Recuperation de la liste des commerciales
app.get("/getAll", (req, res, next) => {
    CommercialPartenaire.find()
        .then((commercialPartenaires) => { res.status(200).send(commercialPartenaires); })
        .catch((error) => { res.status(400).send(error.message); })
});

app.get("/getAllPopulate", (req, res, next) => {
    CommercialPartenaire.find().populate('partenaire_id').populate('user_id')
        .then((commercialPartenaires) => { res.status(200).send(commercialPartenaires); })
        .catch((error) => { res.status(400).send(error.message); })
});

//Recuperation de la liste des commerciales
app.get("/getAllByPartenaireId/:partenaire_id", (req, res, next) => {
    CommercialPartenaire.find({ partenaire_id: req.params.partenaire_id })
        .then((commercialPartenaires) => { res.status(200).send(commercialPartenaires); })
        .catch((error) => { res.status(400).send(error.message); })
});

//Recuperation d'un commercial partenaire via son id
app.get("/getById/:id", (req, res, next) => {
    CommercialPartenaire.findOne({ _id: req.params.id })
        .then((commercialPartenaire) => { res.status(200).send(commercialPartenaire); })
        .catch((error) => { res.status(500).send(error.message); })
});

//Recuperation d'un commercial partenaire via son code
app.get("/getCommercialDataFromCommercialCode/:code", (req, res, next) => {
    CommercialPartenaire.findOne({ code_commercial_partenaire: req.params.code })
        .then((commercialPartenaire) => { res.status(200).send(commercialPartenaire); })
        .catch((error) => { res.status(500).send(error.message); })
});

//Recuperation d'un commercial via son id user
app.get("/getByUserId/:id", (req, res, next) => {
    CommercialPartenaire.findOne({ user_id: req.params.id })
        .then((commercialPartenaire) => { res.status(200).send(commercialPartenaire); })
        .catch((error) => { res.status(500).send(error.message); })
});

//Creation d'un nouveau commercial
app.post("/create", (req, res, next) => {
    //Recuperation des données commercial envoyé depuis le front
    const commercialPartenaireData = req.body.newCommercialPartenaire;

    //Suppression de l'id envoyé depuis le front
    delete commercialPartenaireData._id;
    //Creation du nouvel objet CommercialPartenaire
    const commercialPartenaire = new CommercialPartenaire({ ...commercialPartenaireData });

    //recuperation des données user envoyé depuis le front
    const userData = req.body.newUser;

    //Creation du nouvel objet user
    const user = new User(
        {
            civilite: userData.civilite,
            firstname: userData.firstname,
            lastname: userData.lastname,
            phone: userData.phone,
            email: userData.email,
            email_perso: userData.email,
            password: bcrypt.hashSync(userData.password, 8),
            role: userData.role,
            service_id: userData.service_id,
            type: "Commercial",
            entreprise: userData.entreprise,
            pays_adresse: userData.pays_adresse,
            ville_adresse: userData.ville_adresse,
            rue_adresse: userData.rue_adresse,
            numero_adresse: userData.numero_adresse,
            postal_adresse: userData.postal_adresse,
            date_creation: new Date(),
            verifedEmail: true
            //statut_ent:userData?.statut
        });

    //Verification de l'existence de l'utilisateur
    User.findOne({ email: userData.email })
        .then((userFromDb) => {
            if (userFromDb) {
                CommercialPartenaire.findOne({ user_id: userFromDb._id })
                    .then((commercialPartenaireFromDb) => {
                        if (commercialPartenaireFromDb) {
                            res.status(201).json({ error: 'Cet commercial existe déja' });
                        } else {
                            commercialPartenaire.user_id = userFromDb._id;

                            commercialPartenaire.save()
                                .then((commercialPartenaireSaved) => { res.status(201).json({ success: 'Commercial ajouté' }); })
                                .catch((error) => { res.status(400).json({ error: 'Impossible d\'ajouter ce commercial' }) });
                        }
                    })
                    .catch((error) => { res.status(400).json({ error: 'Impossible de verifier l\'existence de ce commercial ' }) });
            }
            else {
                user.save()
                    .then((userCreated) => {
                        commercialPartenaire.user_id = userCreated._id;
                        commercialPartenaire.save()
                            .then((commercialPartenaireCreated) => { res.status(201).json({ success: 'Commercial crée' }) })
                            .catch((error) => { res.status(400).json({ error: 'Impossible de crée ce commercial' }); });
                    })
                    .catch((error) => { res.status(400).json({ error: 'Impossible de créer un nouvel utilisateur ' }); });
            }
        })
        .catch((error) => { res.status(500).json({ error: 'Impossible de verifier l\'existence de l\'utilisateur' }) });
});


//Modification d'un commercial via son id
app.put("/update", (req, res, next) => {

    //Recuperation des infos commerciale
    const commercialData = req.body.commercialToUpdate;

    //Recuperation des infos user
    const userData = req.body.userToUpdate;

    //D'abord on met à jour le commercial
    CommercialPartenaire.findOneAndUpdate({ _id: commercialData._id },
        {
            partenaire_id: commercialData.partenaire_id,
            user_id: commercialData.user_id,
            code_commercial_partenaire: commercialData.code_commercial_partenaire,
            statut: commercialData.statut,
        })
        .then((commercialPartenaires) => {
            //Une fois le commercial mis à jour, on met à jour le user
            User.findOneAndUpdate({ _id: userData._id },
                {
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    phone: userData.phone,
                    email: userData.email,
                    civilite: userData.civilite,
                })
                .then((users) => { res.status(200).json({ 'success': 'Modification reussie' }); })
                .catch((error) => { res.status(500).json({ 'error': 'Problème de modification' }); });
        })
        .catch((error) => { res.status(500).json({ 'error': 'Problème de modification, contactez un administrateur' }); })

});

app.get('/delete/:id', (req, res) => {
    CommercialPartenaire.findById(req.params.id).then(c => {
        Prospect.updateMany({ code_commercial: { $regex: "^" + c.code_commercial_partenaire } }, { code_commercial: "" }, {}, (err, u) => {
            if (err)
                console.error(err)
        })
        User.findByIdAndRemove(c.user_id, {}, (err, u) => {
            if (err)
                console.error(err)
        })
        CommercialPartenaire.findByIdAndRemove(c._id, {}, (err, cdeleted) => {
            if (err)
                console.error(err)
            else
                res.send(cdeleted)
        })
    })
})

module.exports = app;
