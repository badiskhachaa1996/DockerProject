const express = require('express');
const { User } = require('../models/user');
const app = express();
app.disable("x-powered-by");
const { Entreprise } = require('./../models/entreprise');
const { CAlternance } = require('./../models/contrat_alternance');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'ims@intedgroup.com',
        pass: 'InTeDGROUP@@0908',
    },
});


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
            res.status(201).send(entrepriseSaved);
        })
        .catch((error) => { res.status(400).json({ error: "Impossible d'ajouter une nouvelle entreprise " + error.message }); })

});
app.post("/createNewContrat", (req, res, next) => {

    let CeoData = req.body.CEO
    delete CeoData._id;
    console.log(CeoData.email);
    let EntrepriseData = req.body.entreprise;
    delete EntrepriseData._id;
    let TuteurData = req.body.t1;
    delete TuteurData._id;
    let ContratData = req.body.contratAlternance;
    delete ContratData._id;

    let NewCeo = new User({ ...CeoData })
    let NewEntrepise = new Entreprise({ ...EntrepriseData })
    let NewTuteur = new User({ ...TuteurData })
    let NewContrat = new CAlternance({ ...ContratData })

    //Verification de l'existence de l'Utilisateur
    User.findOne({ email: CeoData.email })
        .then((CeoFromDb) => {
            if (CeoFromDb) {
                res.status(400).json({ error: 'Impossible de créer un nouvel utilisateur-- Email deja Utilisé ' + error.message })
            }
            else {
                NewCeo.save()
                    .then((CeoCreated) => {
                        console.log(CeoCreated.email)

                        NewEntrepise.Directeur_id = CeoCreated._id
                        console.log(NewEntrepise)

                        NewEntrepise.save().then((EntrepCreated) => {
                            console.log("EntrepCreated: ", EntrepCreated._id)
                            NewTuteur.entreprise = EntrepCreated._id
                            NewTuteur.save().then((NewTutData) => {

                                NewContrat.tuteur_id = NewTutData._id
                                NewContrat.save().then((NewContData) => {
                                    let Ceo_Pwd = CeoCreated.firstname.substring(0, 3) + "@" + (Math.random() + 1).toString(16).substring(7).replace(' ', '');
                                    let Ceo_htmlmail =
                                        "<p>Bonjour,</p><p>Votre accés sur notre plateforme a été créé. Pour vous connecter, utilisez votre adresse mail et votre mot de passe : <strong> " +
                                        Ceo_Pwd + "</strong></p>" +
                                        "<p>Si vous avez des difficultés à charger vos documents, vous pouvez les envoyer directement sur l'adresse mail <a href=\"mailto:contact@intedgroup.com\">contact@intedgroup.com</a></p>" +
                                        "<p>Ainsi, pour d'autres demandes d'informations, vous pouvez nous contacter sur notre WhatsApp : +33 188880659 </p>" +
                                        "<p> <br />Nous restons à votre disposition pour tout complément d'information. </p>" +
                                        " <p>Cordialement.</p>";


                                    let Ceo_mailOptions = {
                                        from: "ims@intedgroup.com",
                                        to: CeoCreated.email_perso,
                                        subject: 'Votre acces [IMS] ',
                                        html: Ceo_htmlmail,
                                        // attachments: [{
                                        //     filename: 'Image1.png',
                                        //     path: 'assets/Image1.png',
                                        //     cid: 'Image1' //same cid value as in the html img src
                                        // }]
                                    };
                                    transporterEstya.sendMail(Ceo_mailOptions, function (error, info) {
                                        console.log('Acces CEO Envoyés')
                                        if (error) {
                                            console.error(error);
                                        }
                                    });


                                    let Tuteur_Pwd = NewTutData.firstname.substring(0, 3) + "@" + (Math.random() + 1).toString(16).substring(7).replace(' ', '');
                                    let Teuteur_HtmlMail =
                                        "<p>Bonjour,</p><p>Votre accés sur notre plateforme a été créé. Pour vous connecter, utilisez votre adresse mail et votre mot de passe : <strong> " +
                                        Tuteur_Pwd + "</strong></p>" +
                                        "<p>Si vous avez des difficultés à charger vos documents, vous pouvez les envoyer directement sur l'adresse mail <a href=\"mailto:contact@intedgroup.com\">contact@intedgroup.com</a></p>" +
                                        "<p>Ainsi, pour d'autres demandes d'informations, vous pouvez nous contacter sur notre WhatsApp : +33 188880659 </p>" +
                                        "<p> <br />Nous restons à votre disposition pour tout complément d'information. </p>" +
                                        " <p>Cordialement.</p>";


                                    let Tuteur_mailOptions = {
                                        from: "ims@intedgroup.com",
                                        to: NewTutData.email_perso,
                                        subject: 'Votre acces [IMS] ',
                                        html: Teuteur_HtmlMail,
                                        // attachments: [{
                                        //     filename: 'Image1.png',
                                        //     path: 'assets/Image1.png',
                                        //     cid: 'Image1' //same cid value as in the html img src
                                        // }]
                                    };
                                    transporterEstya.sendMail(Tuteur_mailOptions, function (error, info) {
                                        console.log('Acces Tuteur Envoyés')
                                        if (error) {
                                            console.error(error);
                                        }
                                    });
                                    res.status(200).send([NewContData, EntrepCreated, CeoCreated, NewTutData])
                                }).catch((errorCt) => { res.status(400).json({ error: 'impossible de creer un nouveau Contrat' + errorCt.message }) })



                            }).catch((errorT1) => { res.status(400).json({ error: 'impossible de creer un nouveau tuteur' + errorT1.message }) })



                        })
                            .catch((errorEN) => { res.status(400).json({ error: 'Impossible de créer une nouvelle entreprise ' + errorEN.message }) });
                    })
                    .catch((error) => { res.status(400).json({ error: 'Impossible de créer un nouvel utilisateur ' + error.message }) });
            }
        })
        .catch((error) => { res.status(500).json({ error: 'Impossible de verifier l\'existence de l\'utilisateur ' }) });

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
