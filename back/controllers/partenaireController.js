const express = require("express");
const app = express(); //à travers ça je peux faire la creation des Sujets
const { Partenaire } = require("./../models/partenaire");
const bcrypt = require("bcryptjs");
const { User } = require("./../models/user");
const { CommercialPartenaire } = require("./../models/CommercialPartenaire");
const nodemailer = require('nodemailer');
let origin = ["http://localhost:4200"]
if (process.argv[2]) {
    let argProd = process.argv[2]
    if (argProd.includes('dev')) {
        origin = ["https://t.dev.estya.com"]
    } else (
        origin = ["https://ticket.estya.com", "https://estya.com", "https://adgeducations.com"]
    )
}
app.disable("x-powered-by");


let transporterEH = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'contact@eduhorizons.com',
        pass: 'CeHs2022$',
    },
});
//création d'un nouvel étudiant
app.post("/create", (req, res, next) => {
    //creation du nouvel étudiant
    let partenaireData = req.body.newPartenaire;
    let partenaire = new Partenaire(
        {
            user_id: null,
            nom: partenaireData.nom,
            code_partenaire: partenaireData.code_partenaire,
            lastname: partenaireData.lastname,
            firstname: partenaireData.firstname,
            phone: partenaireData.phone,
            email: partenaireData.email,
            number_TVA: partenaireData.number_TVA,
            SIREN: partenaireData.SIREN,
            APE: partenaireData.APE,
            Services: partenaireData.Services,
            Pays: partenaireData.Pays
        });

    //Verification de l'existence de l'Utilisateur
    Partenaire.findOne({ code_partenaire: partenaireData.code_partenaire })
        .then((partenaireFromDb) => {
            if (partenaireFromDb) {
                res.status(400).json({ error: 'Ce partenaire existe déja' });
            } else {
                partenaire.save()
                    .then((partenaireSaved) => { res.status(201).json({ success: "Partenaure ajouté dans la BD!", data: partenaireSaved }) })
                    .catch((error) => { res.status(400).json({ error: "Impossible d'ajouter ce partenaire " + error.message }) });

            }
        })
        .catch((error) => { res.status(400).json({ msg: "Impossible de verifier l'existence du partenaire", error }) });
});

//création d'un nouvel étudiant
app.post("/inscription", (req, res, next) => {
    //creation du nouvel étudiant

    let partenaireData = req.body.newPartenaire;
    let partenaire = new Partenaire(
        {
            user_id: null,
            code_partenaire: partenaireData.code_partenaire,
            lastname: partenaireData.lastname,
            firstname: partenaireData.firstname,
            phone: partenaireData.phone,
            email: partenaireData.email,
            number_TVA: partenaireData.number_TVA,
            SIREN: partenaireData.SIREN,
            APE: partenaireData.APE,
            Services: partenaireData.Services,
            Pays: partenaireData.Pays,
            type: partenaireData.type,
            WhatsApp: partenaireData.WhatsApp,
            indicatifPhone: partenaireData.indicatifPhone,
            indicatifWhatsApp: partenaireData.indicatifWhatsApp,
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
            indicatif: userData.indicatif,
            verifedEmail: true
            //statut_ent:userData?.statut
        });
    let commercialData = req.body.newCommercial
    let commercial = new CommercialPartenaire(
        {
            code_commercial_partenaire: commercialData.code_commercial_partenaire,
            statut: commercialData.statut,
            user_id: null,
            partenaire_id: null
        }
    )
    //Verification de l'existence de l'Utilisateur
    User.findOne({ email: userData.email })
        .then((userFromDb) => {
            if (userFromDb) {
                Partenaire.findOne({ user_id: userFromDb._id })
                    .then((partenaireFromDb) => {
                        if (partenaireFromDb) {
                            res.status(400).json({ error: 'Ce partenaire existe déja' });
                        } else {

                            commercial.user_id = userFromDb._id;
                            partenaire.save()
                                .then((partenaireSaved) => {
                                    commercial.partenaire_id = partenaireSaved._id
                                    commercial.save().then((commercialsaved) => {
                                        res.status(200).json({ success: "Partenaire ajouté dans la BD!", data: partenaireSaved })
                                    })
                                })
                                .catch((error) => { res.status(400).json({ error: "Impossible d'ajouter ce partenaire " + error.message }) });

                        }
                    })
                    .catch((error) => { res.status(400).json({ msg: "Impossible de verifier l'existence du partenaire", error }) });
            }
            else {
                user.save()
                    .then((userCreated) => {
                        commercial.user_id = userCreated._id;
                        partenaire.save()
                            .then((newPartenaire) => {
                                commercial.partenaire_id = newPartenaire._id
                                commercial.save().then((commercialsaved) => {

                                    let htmlmail =
                                        "<p>Bonjour,</p><p>Votre demarche sur notre plateforme a été enregistré avec succès, merci de connecter avec votre mail et votre mot de passe   sur <a href=\"" + origin + "/#/suivre-ma-preinscription\">ce lien</a> </p>"
                                        + "<ul><li><p ><span style=\"color: rgb(36, 36, 36);font-weight: bolder;\"> Activer Votre compte et valider votre email en cliquant sur" +
                                        " <a href=\"" + origin[0] + "/#/validation-email/" + userCreated.email_perso + "\">J\'active mon compte IMS</a></span></p> " +
                                        "<p> <br />On reste à votre disposition pour tout complément d'information. </p>" +
                                        " <p>Bien cordialement.</p>" +
                                        "<p><img src ='cid:SignatureEmailEH' alt=\" \" width='520' height='227' /></p>";


                                    let mailOptions = {
                                        from: "contact@eduhorizons.com",
                                        to: userCreated.email_perso,
                                        subject: 'Acces IMS',
                                        html: htmlmail,
                                        attachments: [{
                                            filename: 'SignatureEmailEH.png',
                                            path: 'assets/SignatureEmailEH.png',
                                            cid: 'SignatureEmailEH' //same cid value as in the html img src
                                        }]
                                    };
                                    transporterEH.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            console.error(error);

                                        }



                                    });



                                    res.status(201).json({ success: "Partenaire ajouté dans la BD!", data: newPartenaire, commercial: commercialsaved })
                                })
                            })
                            .catch((error) => {
                                console.error(error);
                                res.status(400).send({ error })
                            });
                    })
                    .catch((error) => { res.status(400).json({ error: 'Impossible de créer un nouvel utilisateur ' + error.message }) });
            }
        })
        .catch((error) => { res.status(500).json({ error: 'Impossible de verifier l\'existence de l\'utilisateur ' }) });
});

app.get("/getAll", (req, res) => {
    Partenaire.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
            res.status(404).send(err);
        })
});

app.get("/getNBAll", (req, res) => {
    Partenaire.find()
        .then(result => {
            console.log(result.length);
            res.status(200).send({ nb: result.length });
        })
        .catch(err => {
            console.log(err);

        })
});


//Recuperation d'un partenaire via son id
app.get("/getById/:id", (req, res, next) => {
    Partenaire.findOne({ _id: req.params.id })
        .then((partenaireFromDB) => { res.status(200).send(partenaireFromDB); })
        .catch((error) => { res.status(500).send(error); });
});

app.get("/getAllCodeCommercial/:code_partenaire", (req, res, next) => {
    Partenaire.findOne({ code_partenaire: req.params.code_partenaire })
        .then((partenaireFromDB) => {
            if (partenaireFromDB) {
                CommercialPartenaire.find({ partenaire_id: partenaireFromDB._id }).then(commercials => {
                    res.status(200).send(commercials)
                })
            } else {
                res.status(400).send("Code incorrect, Aucun partenaire trouvé");
            }
        })
        .catch((error) => { res.status(500).send(error); });
});

module.exports = app;
