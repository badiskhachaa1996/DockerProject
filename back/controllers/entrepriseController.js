const express = require('express');
const { User } = require('../models/user');
const app = express();
app.disable("x-powered-by");
const { Entreprise } = require('./../models/entreprise');
const { Tuteur } = require('./../models/Tuteur');
const { CAlternance } = require('./../models/contrat_alternance');
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
const { application } = require('express');
const e = require('express');

let origin = ["http://localhost:4200"]
if (process.argv[2]) {
    let argProd = process.argv[2]
    if (argProd.includes('dev')) {
        origin = ["https://t.dev.estya.com"]
    } else (
        origin = ["https://ticket.estya.com", "https://estya.com", "https://adgeducations.com"]
    )
}
let transporterINTED = nodemailer.createTransport({
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
        .catch((error) => { res.status(500).json({ error: "Impossible de recuperer la liste des entreprises " + error.message }); });
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

//Création d'une nouvelle entreprise avec un représentant 
app.post("/createEntrepriseRepresentant", (req, res, next) => {

    let entrepriseData = req.body.newEntreprise;
    let representantData = req.body.newRepresentant;

    delete entrepriseData._id;
    delete representantData._id;

    let entreprise = new Entreprise(
        {
            ...entrepriseData
        });

    let representant = new User(
        {
            ...representantData
        });

    // verification de la raison sociale de l'entreprise 
    Entreprise.findOne({ r_sociale: entreprise.r_sociale })
        .then((enterpriseFromDB) => {
            if (enterpriseFromDB) {
                res.status(400).send("L'entreprise existe déjà");
            } 
            else {
                User.findOne({ email_perso: representantData.email_perso })
                    .then((userFromDb) => {
                        /**
                         *  Si l'utilisateur existe déjà on attribut son id au directeur_id de l'entreprise
                         *  et un mail lui est envoyé pour lui dire qu'une nouvelle entreprise est ajouté en son nom pour son espace
                        */
                        if (userFromDb) {
                            entreprise.directeur_id = userFromDb._id;
                            entreprise.save()
                                .then((entrepriseSaved) => { 

                                    // création du mail à envoyer
                                    let Ceo_htmlmail =
                                    "<p>Bonjour,</p><p>Une nouvelle entreprise vous à été attribuer sur votre espace, merci de consulter et de consulter les contrats d'alternances, vous récevrez un mail à chaque ajout de contrat.</p>" +
                                    " <p>Cordialement.</p>";


                                    let Ceo_mailOptions =
                                    {
                                        from: "ims@intedgroup.com",
                                        to: userFromDb.email_perso,
                                        subject: 'Votre acces [IMS] ',
                                        html: Ceo_htmlmail,
                                        // attachments: [{
                                        //     filename: 'Image1.png',
                                        //     path: 'assets/Image1.png',
                                        //     cid: 'Image1' //same cid value as in the html img src
                                        // }]
                                    };


                                    // envoi du mail
                                    transporterINTED.sendMail(Ceo_mailOptions, function (error, info) {
                                        if (error) {
                                            console.error(error);
                                        }
                                    });
                                    
                                    res.status(201).send(entrepriseSaved); 
                                })
                                .catch((error) => { console.log(error); res.status(400).send('Impossible de créer la nouvelle entreprise') })
                        }
                        /**
                         * Si l'utilisateur saisie n'existe pas dans la base de données alors on le créer et un mail avec ses identifiants lui sont envoyés
                         */
                        else {
                            //Création des accès pour les CEO
                            let Ceo_Pwd = representant.firstname.substring(0, 3) + "@" + (Math.random() + 1).toString(16).substring(7).replace(' ', '');
                            representant.password = bcrypt.hashSync(Ceo_Pwd, 8);

                            representant.save()
                                .then((userCreated) => {
                                    entreprise.directeur_id = userCreated._id;
                                    entreprise.save()
                                        .then((entrepriseSaved) => {
                                            // création du mail à envoyer
                                            let Ceo_htmlmail =
                                                "<p>Bonjour,</p><p>Votre accés sur notre plateforme a été créé. Pour vous connecter, utilisez votre adresse mail et votre mot de passe : <strong> " +
                                                Ceo_Pwd + "</strong></p>" +
                                                "<p ><span style=\"color: rgb(36, 36, 36);font-weight: bolder;\"> Activer votre compte et valider votre email en cliquant sur" +
                                                " <a href=\"" + origin[0] + "/#/validation-email/" + userCreated.email_perso + "\">J\'active mon compte IMS</a></span></p> " +
                                                "<p>Si vous avez des difficultés à vous connecter, vous pouvez nous contacter directement sur l'adresse mail <a href=\"mailto:contact@intedgroup.com\">contact@intedgroup.com</a></p>" +
                                                "<p> <br />Nous restons à votre disposition pour tout complément d'information. </p>" +
                                                " <p>Cordialement.</p>";


                                            let Ceo_mailOptions =
                                            {
                                                from: "ims@intedgroup.com",
                                                to: userCreated.email_perso,
                                                subject: 'Votre acces [IMS] ',
                                                html: Ceo_htmlmail,
                                                // attachments: [{
                                                //     filename: 'Image1.png',
                                                //     path: 'assets/Image1.png',
                                                //     cid: 'Image1' //same cid value as in the html img src
                                                // }]
                                            };


                                            // envoi du mail
                                            transporterINTED.sendMail(Ceo_mailOptions, function (error, info) {
                                                if (error) {
                                                    console.error(error);
                                                }
                                            });

                                            // envoi de la reponse du serveur
                                            res.status(201).send(entrepriseSaved);
                                        })
                                        .catch((error) => { res.status(400).send('Impossible de créer une nouvelle entreprise') });
                                })
                                .catch((error) => { res.status(400).send('Impossible de créer un nouvel utilisateur') });
                        }
                    })
                    .catch((error) => { res.status(500).send("Impossible de vérifier l'existence de l'utilisateur") });
            }
        })
        .catch((error) => { console.log(error); res.status(500).send("Impossible de verifier l'existence de l'entreprise") })


});


//Modification d'une entreprise et de son representant
app.put("/updateEntrepriseRepresentant", (req, res) => {

    let entrepriseData = req.body.entrepriseToUpdate;
    let representantData = req.body.representantToUpdate;

    User.findOneAndUpdate({ _id: representantData._id },
        {
            ...representantData
        })
        .then((userSaved) => {
            Entreprise.findOneAndUpdate({ _id: entrepriseData._id },
                {
                    ...entrepriseData
                })
                .then((entrepriseFromDb) => res.status(201).send(entrepriseFromDb))
                .catch((error) => { res.status(500).send("Impossible de mettre à jour l'entreprise") }
                )
                .catch((error) => { res.status(500).send('Impossible de mettre à jour le representant') })
        });
});

app.post("/createNewContrat", (req, res, next) => {

    let CeoData = req.body.CEO
    delete CeoData._id;
    let EntrepriseData = req.body.entreprise;
    delete EntrepriseData._id;
    let TuteurData = req.body.t1;
    delete TuteurData._id;
    let tuteurObject = req.body.TuteurObject
    delete tuteurObject._id
    let ContratData = req.body.contratAlternance;

    delete ContratData._id;

    let NewCeo = new User({ ...CeoData })
    let NewEntrepise = new Entreprise({ ...EntrepriseData })
    let NewTuteur = new User({ ...TuteurData })
    let NewContrat = new CAlternance({ ...ContratData })
    let NewtuteurObject = new Tuteur({ ...tuteurObject })

    NewContrat.alternant_id = ContratData.alternant_id
    //Verification de l'existence du mail CEO dans la BD
    User.findOne({ email: CeoData.email })
        .then((CeoFromDb) => {
            if (CeoFromDb) {


                res.status(400).json({ error: 'Impossible de créer un nouvel utilisateur-- Email deja Utilisé ' })
            }
            else {
                //Creation d'un nouveau utilisateur CEO d'entreprise
                let Ceo_Pwd = NewCeo.firstname.substring(0, 3) + "@" + (Math.random() + 1).toString(16).substring(7).replace(' ', '');
                NewCeo.password = bcrypt.hashSync(Ceo_Pwd, 8),

                    NewCeo.save()
                        .then((CeoCreated) => {

                            NewEntrepise.Directeur_id = CeoCreated._id
                            //Creation d'une nouvelle entreprise
                            NewEntrepise.save().then((EntrepCreated) => {

                                if (NewTuteur.email === CeoCreated.email) {
                                    NewtuteurObject.entreprise_id = EntrepCreated._id
                                    NewtuteurObject.save().then(NewobjTuteur => {
                                        NewContrat.tuteur_id = NewobjTuteur._id
                                        //Creation d'un nouveau contrat alternance
                                        NewContrat.save().then((NewContData) => {
                                            // Initialisation et Envoi des accés par email pour le CEO et le tuteur 

                                            let Ceo_htmlmail =
                                                "<p>Bonjour,</p><p>Votre accés sur notre plateforme a été créé. Pour vous connecter, utilisez votre adresse mail et votre mot de passe : <strong> " +
                                                Ceo_Pwd + "</strong></p>" +
                                                "<p ><span style=\"color: rgb(36, 36, 36);font-weight: bolder;\"> Activer votre compte et valider votre email en cliquant sur" +
                                                " <a href=\"" + origin[0] + "/#/validation-email/" + CeoCreated.email_perso + "\">J\'active mon compte IMS</a></span></p> " +
                                                "<p>Si vous avez des difficultés à vous connecter, vous pouvez nous contacter directement sur l'adresse mail <a href=\"mailto:contact@intedgroup.com\">contact@intedgroup.com</a></p>" +
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
                                            transporterINTED.sendMail(Ceo_mailOptions, function (error, info) {
                                                if (error) {
                                                    console.error(error);
                                                }
                                            });

                                            res.status(200).send([NewContData, EntrepCreated, CeoCreated])
                                        }).catch((errorCt) => {

                                            res.status(400).json({ error: 'impossible de creer un nouveau Contrat' + errorCt.message })
                                        })
                                    }).catch((errorCt) => {

                                        res.status(400).json({ error: 'impossible de creer un nouveau Contrat' + errorCt.message })
                                    })

                                }
                                else {
                                    NewtuteurObject.entreprise_id = EntrepCreated._id
                                    NewTuteur.entreprise = EntrepCreated._id

                                    //Cration d'un utilisateur Tuteur d'entreprise
                                    let Tuteur_Pwd = NewTuteur.firstname.substring(0, 3) + "@" + (Math.random() + 1).toString(16).substring(7).replace(' ', '');
                                    NewTuteur.password = bcrypt.hashSync(Tuteur_Pwd, 8),
                                        NewTuteur.save().then((NewTutData) => {
                                            NewtuteurObject.user_id = NewTutData._id

                                            NewtuteurObject.save().then(NewobjTuteur => {




                                                NewContrat.tuteur_id = NewobjTuteur._id
                                                //Creation d'un nouveau contrat alternance
                                                NewContrat.save().then((NewContData) => {
                                                    // Initialisation et Envoi des accés par email pour le CEO et le tuteur 

                                                    let Ceo_htmlmail =
                                                        "<p>Bonjour,</p><p>Votre accés sur notre plateforme a été créé. Pour vous connecter, utilisez votre adresse mail et votre mot de passe : <strong> " +
                                                        Ceo_Pwd + "</strong></p>" +
                                                        "<p ><span style=\"color: rgb(36, 36, 36);font-weight: bolder;\"> Activer votre compte et valider votre email en cliquant sur" +
                                                        " <a href=\"" + origin[0] + "/#/validation-email/" + CeoCreated.email_perso + "\">J\'active mon compte IMS</a></span></p> " +
                                                        "<p>Si vous avez des difficultés à vous connecter, vous pouvez nous contacter directement sur l'adresse mail <a href=\"mailto:contact@intedgroup.com\">contact@intedgroup.com</a></p>" +
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
                                                    transporterINTED.sendMail(Ceo_mailOptions, function (error, info) {
                                                        if (error) {
                                                            console.error(error);
                                                        }
                                                    });



                                                    let Teuteur_HtmlMail =
                                                        "<p>Bonjour,</p><p>Votre accés sur notre plateforme a été créé. Pour vous connecter, utilisez votre adresse mail et votre mot de passe : <strong> " +
                                                        Tuteur_Pwd + "</strong></p>" +
                                                        "<p ><span style=\"color: rgb(36, 36, 36);font-weight: bolder;\"> Activer votre compte et valider votre email en cliquant sur" +
                                                        " <a href=\"" + origin[0] + "/#/validation-email/" + NewTutData.email_perso + "\">J\'active mon compte IMS</a></span></p> " +
                                                        "<p>Si vous avez des difficultés à vous connecter, vous pouvez nous contacter directement sur l'adresse mail <a href=\"mailto:contact@intedgroup.com\">contact@intedgroup.com</a></p>" +
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
                                                    transporterINTED.sendMail(Tuteur_mailOptions, function (error, info) {

                                                        if (error) {
                                                            console.error(error);
                                                        }
                                                    });

                                                    res.status(200).send([NewContData, EntrepCreated, CeoCreated, NewTutData])
                                                }).catch((errorCt) => {

                                                    res.status(400).json({ error: 'impossible de creer un nouveau Contrat' + errorCt.message })
                                                })

                                            })
                                        }).catch((errorT1) => {

                                            res.status(400).json({ error: 'impossible de creer un nouveau tuteur' + errorT1.message })
                                        })
                                }
                            })
                                .catch((errorEN) => {

                                    res.status(400).json({ error: 'Impossible de créer une nouvelle entreprise ' + errorEN.message })
                                });
                        })
                        .catch((error) => {
                            res.status(400).json({ error: 'Impossible de créer un nouvel utilisateur ' + error.message })
                        });
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(501).json({ error })
        });

});

app.post("/createContratAlternance", (req, res, next) => {
    let ContratData = req.body;
    delete ContratData._id;
    let NewContrat = new CAlternance({
        ...ContratData
    })

    // verification si le tuteur est un directeur
    Tuteur.findOne({ _id: NewContrat.tuteur_id })
        .then((tuteur) => {
            if (tuteur) {
                NewContrat.directeur_id = null;
                //création du contrat
                NewContrat.save()
                    .then((NewContData) => {
                        // recuperation de l'adresse mail du directeur de l'entreprise
                        Entreprise.findOne({ _id: NewContData.entreprise_id })
                        .then((entreprise) => {
                            User.findOne({ _id: entreprise.directeur_id})
                            .then((user) => {
                                // création du mail à envoyer
                                let Ceo_htmlmail = "<p>Bonjour,</p><p>Un nouveau contrat est disponible sur votre espace IMS, merci de verifier son contenu.</p><p>ims.intedgroup.com/#/login</p>";

                                let Ceo_mailOptions =
                                {
                                    from: "ims@intedgroup.com",
                                    to: user.email_perso,
                                    subject: 'Nouveau contrat [IMS]',
                                    html: Ceo_htmlmail,
                                    // attachments: [{
                                    //     filename: 'Image1.png',
                                    //     path: 'assets/Image1.png',
                                    //     cid: 'Image1' //same cid value as in the html img src
                                    // }]
                                };


                                // envoi du mail
                                transporterINTED.sendMail(Ceo_mailOptions, function (error, info) {
                                    if (error) {
                                        console.error(error);
                                    }
                                });

                                res.status(200).send(NewContData);
                            })
                            .catch((error) => { console.log(error); res.status(400).send(error) })
                            
                        })
                        .catch((error) => { res.status(400).send(error); })
                    })
                    .catch((error) => {
                        res.status(400).json({ error: 'Impossible de créer un nouveau contrat ' + error.message })
                    })
            }
            else {
                NewContrat.directeur_id = NewContrat.tuteur_id;
                NewContrat.tuteur_id = null;

                //création du contrat
                NewContrat.save()
                    .then((NewContData) => {
                        Entreprise.findOne({ _id: NewContData.entreprise_id })
                        .then((entreprise) => {
                            User.findOne({ _id: entreprise.directeur_id})
                            .then((user) => {
                                // création du mail à envoyer
                                let Ceo_htmlmail = "<p>Bonjour,</p><p>Un nouveau contrat est disponible sur votre espace IMS, merci de verifier son contenu.</p><p>ims.intedgroup.com/#/login</p>";

                                let Ceo_mailOptions =
                                {
                                    from: "ims@intedgroup.com",
                                    to: user.email_perso,
                                    subject: 'Nouveau contrat [IMS]',
                                    html: Ceo_htmlmail,
                                    // attachments: [{
                                    //     filename: 'Image1.png',
                                    //     path: 'assets/Image1.png',
                                    //     cid: 'Image1' //same cid value as in the html img src
                                    // }]
                                };


                                // envoi du mail
                                transporterINTED.sendMail(Ceo_mailOptions, function (error, info) {
                                    if (error) {
                                        console.error(error);
                                    }
                                });

                                res.status(200).send(NewContData);
                            })
                            .catch((error) => { console.log(error); res.status(400).send(error) })
                            
                        })
                        .catch((error) => { res.status(400).send(error); })
                    })
                    .catch((error) => {
                        res.status(400).json({ error: 'Impossible de créer un nouveau contrat ' + error.message })
                    })
            }
        })
        .catch((error) => { res.status(500).send(error); });

});

app.post("/updateContratAlternance", (req, res, next) => {
    let ContratData = new CAlternance({ ...req.body });

    // verification si le tuteur est un directeur
    Tuteur.findOne({ _id: ContratData.tuteur_id })
        .then((tuteur) => {
            if (tuteur) {
                ContratData.directeur_id = null;

                CAlternance.findByIdAndUpdate(ContratData._id, ContratData, { new: true }, (err, value) => {
                    if (err) {
                        console.error(err)
                        res.status(500).send(err)
                    } else {
                        res.status(201).send(value)
                    }
                })

            } else {
                ContratData.directeur_id = ContratData.tuteur_id;
                ContratData.tuteur_id = null;

                CAlternance.findByIdAndUpdate(ContratData._id, ContratData, { new: true }, (err, value) => {
                    if (err) {
                        console.error(err)
                        res.status(500).send(err)
                    } else {
                        res.status(201).send(value)
                    }
                })
            }
        })
        .catch((error) => { res.status(500).send(error); });
});


app.get("/getAllContratsbyTuteur/:idTuteur", (req, res, next) => {
    CAlternance.find({ tuteur_id: req.params.idTuteur }).populate({ path: 'alternant_id', populate: { path: "user_id" } }).populate({ path: 'formation' }).populate({ path: 'tuteur_id', populate: { path: "user_id" } })?.populate('ecole')?.populate('code_commercial')?.populate('directeur_id')?.populate('entreprise_id')
        .then((CAFromDb) => {
            res.status(200).send(CAFromDb);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: "Impossible de recuperer la liste des contrats " + error.message
            });
        });
});

app.get("/getAllContratsbyEntreprise/:entreprise_id", (req, res, next) => {
    CAlternance.find({ entreprise_id: req.params.entreprise_id}).populate({ path: 'alternant_id', populate: { path: "user_id" } }).populate({ path: 'tuteur_id', populate: { path: "user_id" } }).populate({ path: 'formation' })?.populate('ecole')?.populate('code_commercial')?.populate('directeur_id')?.populate('entreprise_id')
        .then((CAFromDb) => {
            res.status(200).send(CAFromDb);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: "Impossible de recuperer la liste des contrats " + error.message
            });
        });
});

app.get("/getAllContrats/", (req, res, next) => {
    CAlternance.find().populate({ path: 'alternant_id', populate: { path: "user_id" } }).populate({ path: 'tuteur_id', populate: { path: "user_id" } }).populate('formation')?.populate('code_commercial')?.populate('directeur_id')?.populate('ecole')?.populate('entreprise_id')
        .then((CAFromDb) => {
            res.status(200).send(CAFromDb);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: "Impossible de recuperer la liste des contrats " + error.message
            });
        });

});

//Recuperation d'une entreprise selon un id
app.get("/getById/:id", (req, res, next) => {
    Entreprise.findOne({ _id: req.params.id })
        .then((entrepriseFormDb) => { res.status(200).send(entrepriseFormDb); })
        .catch((error) => { res.status(500).json({ error: "Impossible de recuperer cette entreprise" }) })
});

//Recuperation d'une entreprise selon un id en populate
app.get("/getByIdPopulate/:id", (req, res, next) => {
    Entreprise.findOne({ _id: req.params.id })?.populate('directeur_id')
        .then((entrepriseFormDb) => { res.status(200).send(entrepriseFormDb); })
        .catch((error) => { res.status(500).json({ error: "Impossible de recuperer cette entreprise" }) })
});

//recupération d'une liste d'entreprise selon id director
app.get("/getByDirecteurId/:id", (req, res, next) => {
    Entreprise.findOne({ directeur_id: req.params.id })
        .then((entrepriseFormDb) => { res.status(200).send(entrepriseFormDb); })
        .catch((error) => { res.status(500).json({ error: "Impossible de recuperer cette entreprise" }) })
})

//récupération d'un contrat d'alternance en fonction de l'id étudiant
app.get("/getByEtudiantId/:id", (req, res, next) => {
    CAlternance.findOne({ alternant_id: req.params.id })
        .then((entrepriseFormDb) => { res.status(200).send(entrepriseFormDb); })
        .catch((error) => { res.status(500).json({ error: "Impossible de recuperer ce contrat" }) })
})
app.get("/getByEtudiantIdPopolate/:id", (req, res, next) => {
    CAlternance.findOne({ alternant_id: req.params.id }).populate({ path: 'tuteur_id' })
        .then((ContratDetails) => {
            res.status(200).send(ContratDetails);
        })
        .catch((error) => { res.status(500).json({ error: "Impossible de recuperer ce contrat" }) })
})

//Modification d'une entreprise
app.put("/update", (req, res, next) => {

    Entreprise.findOneAndUpdate({ _id: req.body._id },
        {
            ...req.body
        })
        .then((entrepriseUpdated) => { res.status(201).send(entrepriseUpdated); })
        .catch((error) => { res.status(400).send("Impossible de modifier cette entreprise"); });

});


//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;
