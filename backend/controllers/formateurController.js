const express = require('express');
const app = express();
const { Formateur } = require('./../models/formateur');
const { User } = require('./../models/user');

//Recupère la liste des formateurs
app.get("/getAll", (req, res, next) => {
    Formateur.find()
        .then((formateursFromDb) => { res.status(200).send(formateursFromDb) })
        .catch((error) => { res.status(500).json({ error: "Impossible de recuperer la liste des formateur " + error.Message }) })
});

//Recupère la liste d'un formateur via un id formateur
app.get("/getById/:id", (req, res, next) => {
    Formateur.findOne({ _id: req.params.id })
        .then((formateurFromDb) => { res.status(200).send(formateurFromDb) })
        .catch((error) => { res.status(400).json({ error: "Impossible de recuperer ce formateur via son id " + error }) });
});

//Recupère un formateur via un userId
app.get("/getByUserId/:id", (req, res, next) => {
    Formateur.findOne({ user_id: req.params.id })
        .then((formateurFromDb) => { res.status(200).send(formateurFromDb) })
        .catch((error) => { res.status(400).json({ error: "Impossible de recuperer cet formateur via son userId " + error.message }) });
})

//Récupère le dictionaire id:formateur
app.get("/getAllUser", (req, res, next) => {
    var dicformateur = {};
    Formateur.find()
        .then((formateurList) => {
            User.find().then((UserList) => {
                var dicUser = {};

                UserList.forEach(formateur => {
                    dicUser[formateur._id] = formateur
                })
                formateurList.forEach(formateur => {
                    dicformateur[formateur._id] = dicUser[formateur.user_id]
                })
                res.status(200).send(dicformateur)
            }).catch((error) => {
                console.log(error)
                res.status(400).json({ error: "Impossible de recuperer les users" + error.message })
            });
        })
        .catch((error) => {
            console.log(error)
            res.status(400).json({ error: "Impossible de recuperer les users" + error.message })
        });
})

//Création d'un nouveau formateur et d'un nouveau user par la même occasion
app.post("/create", (req, res, next) => {

    //Création d'un nouvel objet formateur
    let data = req.body.newFormateur;
    
    let formateur = new Formateur(
        {
            user_id: data.user_id, //null
            statut: data.statut,
            type_contrat: data?.type_contrat,
            taux_h: data.taux_h,
            taux_j: data.taux_j,
            isInterne: data?.isInterne,
            prestataire_id: data?.prestataire,
            volume_h: data?.volume_h,
            volume_h_consomme: data?.volume_h_consomme
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
            /*password: bcrypt.hashSync(data.password, 8),*/
            role: userData.role,
            service_id: null,
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
                Formateur.findOne({ user_id: userFromDb._id })
                    .then((formateurFromDb) => {
                        if (formateurFromDb) {
                            res.status(201).json({ error: 'Cet formateur existe déja' });
                        } else {
                            formateur.user_id = userFromDb._id;
                            formateur.save()
                                .then((formateurFromDb) => { res.status(201).json({ success: "Formateur ajouté dans la BD!" }) })
                                .catch((error) => { res.status(400).json({ error: "Impossible d'ajouter ce formateur " + error }) });

                        }
                    })
                    .catch((error) => { res.status(400).json({ error: "Impossible de verifier l'existence du formateur" }) });
            }
            else {
                user.save()
                    .then((userCreated) => {
                        formateur.user_id = userCreated._id;
                        formateur.save()
                            .then((formateurCreated) => { res.status(201).json({ success: 'Formateur crée' }) })
                            .catch((error) => { res.status(400).json({ error: 'Impossible de crée ce formateur' }) });
                    })
                    .catch((error) => { res.status(400).json({ error: 'Impossible de créer un nouvel utilisateur ' + error.message }) });
            }
        })
        .catch((error) => { res.status(500).json({ error: 'Impossible de verifier l\'existence de l\'utilisateur ' }) });
});

//Modification d'un formateur via son id formateur
app.post('/updateById/:id', (req, res, next) => {
    Formateur.findOneAndUpdate({ _id: req.params.id },
        {
            user_id: req.body?.user_id,
            statut: req.body?.statut,
            type_contrat: req.body?.type_contrat,
            taux_h: req.body?.taux_h,
            taux_j: req.body?.taux_j,
            isInterne: req.body?.isInterne,
            prestataire_id: req.body.prestataire_id,
            volume_h: req.body?.volume_h,
            volume_h_consomme: req.body?.volume_h_consomme

        }, { new: true }, (err, formateurUpdated) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(formateurUpdated)
            }
        });
});

//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;
