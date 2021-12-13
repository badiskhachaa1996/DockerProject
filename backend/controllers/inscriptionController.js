const express = require("express");
const app = express();
const { Inscription } = require("./../models/inscription");
const { User } = require("./../models/user");

app.post("/create", (req, res) => {
    //Ajouter une inscription pour un user existant ( réinscription)
    let data = req.body;
    let inscription = new Inscription({
        user_id: data.user_id,
        statut: data.statut,
        diplome: data.diplome,

    });
    inscription.save().then((inscriptionFromDB) => {
        res.status(200).send(inscriptionFromDB);
    }).catch((error) => {
        res.status(404).send(error);
    })

});
// Ajouter une premiere inscription implique creation d'un user 
app.post("/firstInscription", (req, res) => {
    //Ajouter une inscription pour un user existant ( réinscription)
    let data = req.body.newInscription;
    let inscription = new Inscription({
        user_id: data.user_id,
        statut: data.statut,
        diplome: data.diplome,

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
    //vérification de l'existence du user
    User.findOne({ email_perso: userData.email_perso })
        .then((userFromDb) => {
            if (userFromDb) {
                inscription.user_id = userFromDb.user_id;
                inscription.save().then((InscriptionFromDb) => { res.status(201).json({ success: "Inscription ajouté !" }) })
                    .catch((error) => { res.status(400).json({ error: "Impossible d'ajouter l'inscription " + error }) });
            }
        
    else {
        user.save().then((userCreated) => {
            inscription.user_id = userCreated._id;
            Inscription.save()
            .then((inscriptionCreated) => { res.status(201).json({ success: 'Inscription crée' }) })
            .catch((error) => { res.status(400).json({ error: 'Impossible de crée cette inscription' }) });
    })
    .catch((error) => { res.status(400).json({ error: 'Impossible de créer un nouvel utilisateur ' + error.message }) });
            }
        })
        .catch ((error) => { res.status(500).json({ error: 'Impossible de verifier l\'existence de l\'utilisateur ' }) });

});
//Modifier une inscription par ID
app.post("/editById/:id", (req, res) => {
    Inscription.findOneAndUpdate(req.params.id,
        {
            date_de_naissance: req.body.date_de_naissance,
            annee_id: req.body.annee_id,
            statut: req.body.statut,
            diplome: req.body.diplome,
            nationalite: req.body.nationalite,


        }).then((inscriptionFromDB) => {
            res.status(201).send(inscriptionFromDB);
        }).catch((error) => {
            res.status(400).send(error);
        })


    app.get("/getAll", (req, res) => {
        //Récupérer toutes les inscription
        Inscription.find().then(result => {
            res.send(result.length > 0 ? result : [])
        })
            .catch((error) => {
                console.error(error);
            })
    });

    app.get("/getById/:id", (req, res) => {
        //Récupérer une école via un ID
        Inscription.findOne({ _id: req.params.id }).then((dataInscription) => {
            res.status(200).send({ dataInscription });
        }).catch((error) => {
            res.status(404).send(error);
        })
    })
});
module.exports = app;