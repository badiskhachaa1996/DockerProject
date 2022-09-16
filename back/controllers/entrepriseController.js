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
    console.log(req.body)
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

        
    User.findOne({ email_perso: representantData.email_perso})
        .then((userFromDb) => {
            if(userFromDb)
            {
                entreprise.directeur_id = userFromDb._id;
                entreprise.save()
                        .then((entrepriseSaved) => { res.status(201).send(entrepriseSaved);})
                        .catch((error) => {res.status(400).send('Impossible de créer la nouvelle entreprise')})
            }
            else
            {
                representant.save()
                    .then((userCreated) => {
                        entreprise.directeur_id = userCreated._id;
                        entreprise.save()
                                .then((entrepriseSaved) => { res.status(201).send(entrepriseSaved); })
                                .catch((error) => { res.status(400).send('Impossible de créer une nouvelle entreprise')});
                    })
                    .catch((error) => {res.status(400).send('Impossible de créer un nouvel utilisateur')});
            }
        })
        .catch((error) => {res.status(500).send("Impossible de vérifier l'existence de l'utilisateur")});    

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
    console.log(ContratData)
    delete ContratData._id;

    let NewCeo = new User({ ...CeoData })
    let NewEntrepise = new Entreprise({ ...EntrepriseData })
    let NewTuteur = new User({ ...TuteurData })
    let NewContrat = new CAlternance({ ...ContratData })
    let NewtuteurObject = new Tuteur({ ...tuteurObject })

    NewContrat.alternant_id = ContratData.alternant_id
    console.log(ContratData.alternant_id + ':')
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
                                                console.log('Acces CEO Envoyés')
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
                                                        console.log('Acces CEO Envoyés')
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
                                                        console.log('Acces Tuteur Envoyés')


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
                            console.log("loco4")
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
    console.log(ContratData)
    let NewContrat = new CAlternance({
        ...ContratData
    })

    //création du contrat
    NewContrat.save()
        .then((NewContData) => {
            console.log("créé");
            res.status(200).send(NewContData);
        })
        .catch((error) => {
            console.log(error)
            res.status(400).json({ error: 'Impossible de créer un nouveau contrat ' + error.message })
        })

});


app.get("/getAllContratsbyTuteur/:idTuteur", (req, res, next) => {
    CAlternance.find({ tuteur_id: req.params.idTuteur }).populate({ path: 'alternant_id', populate: { path: "user_id" } }).populate({ path: 'formation' }).populate({ path: 'tuteur_id', populate: { path: "user_id" } })
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
    console.log("getAllContratsbyEntreprise")
    CAlternance.find().populate({ path: 'alternant_id', populate: { path: "user_id" } }).populate({ path: 'tuteur_id' }).populate({ path: 'formation' })
        .then((CAFromDb) => {
            let CAbyEntreprise = [];

            CAFromDb.forEach(async Contrat => {

                if (Contrat.tuteur_id?.entreprise_id == req.params.entreprise_id) {
                    CAbyEntreprise.push(Contrat)
                }


            })
            res.status(200).send(CAbyEntreprise);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: "Impossible de recuperer la liste des contrats " + error.message
            });
        });
});

app.get("/getAllContrats/", (req, res, next) => {
    console.log("getAllContrats")
    CAlternance.find().populate({ path: 'alternant_id', populate: { path: "user_id" } }).populate({ path: 'tuteur_id', populate: { path: "user_id" } }).populate({ path: 'formation' }).populate({ path: 'code_commercial' })
        .then((CAFromDb) => {
            console.log(CAFromDb)
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

//recupération d'une liste d'entreprise selon id director
app.get("/getByDirecteurId/:id", (req, res, next) => {
    Entreprise.findOne({ Directeur_id: req.params.id })
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
            console.log(ContratDetails)
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
