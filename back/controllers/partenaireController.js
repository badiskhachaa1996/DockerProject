const express = require("express");
const app = express(); //à travers ça je peux faire la creation des Sujets
const { Partenaire } = require("./../models/partenaire");
const bcrypt = require("bcryptjs");
const { User } = require("./../models/user");
const { CommercialPartenaire } = require("./../models/CommercialPartenaire");
const nodemailer = require('nodemailer');
const { Prospect } = require("../models/prospect");
let origin = ["http://localhost:4200"]
if (process.argv[2]) {
    let argProd = process.argv[2]
    if (argProd.includes("dev")) {
        origin = ["https://141.94.71.25", "https://dev-ims.intedgroup.com"];
    } else if (argProd.includes("qa")) {
        origin = ["https://152.228.219.55", "https://qa-ims.intedgroup.com"];
    } else if (argProd.includes("prod2")) {
        origin = ["https://51.68.215.184", "https://prod2-ims.intedgroup.com"];
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
        user: 'ims@intedgroup.com',
        pass: 'InTeDGROUP@@0908',
    },
});
//création d'un nouvel étudiant
app.post("/create", (req, res, next) => {
    //creation du nouvel étudiant
    let partenaireData = req.body.newPartenaire;
    let partenaire = new Partenaire(
        {
            user_id: null,
            code_partenaire: partenaireData.code_partenaire,
            nom: partenaireData.nom,
            lastname: partenaireData.lastname,
            firstname: partenaireData.firstname,
            phone: partenaireData.phone,
            email: partenaireData.email,
            number_TVA: partenaireData.number_TVA,
            SIREN: partenaireData.SIREN,
            SIRET: partenaireData.SIRET,
            APE: partenaireData.APE,
            Services: partenaireData.Services,
            Pays: partenaireData.Pays,
            type: partenaireData.type,
            WhatsApp: partenaireData.WhatsApp,
            indicatifPhone: partenaireData.indicatifPhone,
            indicatifWhatsApp: partenaireData.indicatifWhatsApp,
        });

    //Verification de l'existence de l'Utilisateur
    Partenaire.findOne({ code_partenaire: partenaireData.code_partenaire })
        .then((partenaireFromDb) => {
            if (partenaireFromDb) {
                res.status(400).json({ error: 'Ce partenaire existe déja' });
            } else {
                partenaire.save()
                    .then((partenaireSaved) => { res.status(201).json({ success: "Partenaire ajouté dans la BD!", data: partenaireSaved }) })
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
            ...partenaireData
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
            partenaire_id: null,
            isAdmin: true,
            pays: partenaireData.Pays
        }
    )
    delete partenaire._id
    //Verification de l'existence de l'Utilisateur
    User.findOne({ email: userData.email })
        .then((userFromDb) => {
            if (userFromDb) {
                Partenaire.findOne({ user_id: userFromDb._id })
                    .then((partenaireFromDb) => {
                        if (partenaireFromDb) {
                            res.status(400).json({ error: 'Ce partenaire existe déja' });
                        } else {
                            partenaire['user_id'] = userFromDb._id
                            commercial.user_id = userFromDb._id;
                            partenaire.save()
                                .then((partenaireSaved) => {
                                    Partenaire.findOne({ nom: partenaireSaved.nom, email: partenaireSaved.email, code_partenaire: partenaireSaved.code_partenaire }).then(nouveauPartenaire => {
                                        commercial.partenaire_id = nouveauPartenaire._id
                                        commercial.save().then((commercialsaved) => {

                                            let htmlmail =
                                                "<p>Bonjour,</p><p>Un nouveau partenaire a été enregistré avec succès, Voici les accès à utiliser sur <a href='https://ims.intedgroup.com/#/login'>ce lien</a> en se connectant via les identifiants </p><br>" +
                                                `<p>Email:${userData.email_perso} | Mot de passe : <strong>${userData.password}</strong> </p>` +
                                                "<p> <br />On reste à votre disposition pour tout complément d'information. </p>" +
                                                " <p>Bien cordialement.</p>" +
                                                "<p><img src ='cid:SignatureEmailEH' alt=\" \" width='520' height='227' /></p>";


                                            let mailOptions = {
                                                from: "ims@intedgroup.com",
                                                to: ['orientation.aa@intedgroup.com', 'h.elkadhi@intedgroup.com', userData.email_perso],
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
                                                console.log(info)
                                            });


                                            res.status(201).json({ success: "Partenaire ajouté dans la BD!", data: newPartenaire, commercial: commercialsaved })
                                        })
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
                        commercial['user_id'] = userCreated._id;
                        partenaire['user_id'] = userCreated._id
                        partenaire.save().then(newPartenaire => {
                            Partenaire.findOne({ nom: newPartenaire.nom, email: newPartenaire.email, code_partenaire: newPartenaire.code_partenaire }).then(nouveauPartenaire => {
                                commercial.partenaire_id = nouveauPartenaire._id
                                commercial.save().then((commercialsaved) => {

                                    let htmlmail =
                                        "<p>Bonjour,</p><p>Un nouveau partenaire a été enregistré avec succès, Voici les accès à utiliser sur <a href='https://ims.intedgroup.com/#/login'>ce lien</a> en se connectant via les identifiants </p><br>" +
                                        `<p>Email:${userData.email_perso} | Mot de passe : <strong>${userData.password}</strong> </p>` +
                                        "<p> <br />On reste à votre disposition pour tout complément d'information. </p>" +
                                        " <p>Bien cordialement.</p>" +
                                        "<p><img src ='cid:SignatureEmailEH' alt=\" \" width='520' height='227' /></p>";


                                    let mailOptions = {
                                        from: "ims@intedgroup.com",
                                        to: ['orientation.aa@intedgroup.com', 'h.elkadhi@intedgroup.com', userData.email_perso],
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
                                        console.log()
                                    });



                                    res.status(201).json({ success: "Partenaire ajouté dans la BD!", data: newPartenaire, commercial: commercialsaved })
                                })
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
    Partenaire.find().populate('user_id').populate({ path: 'manage_by', populate: { path: 'user_id' } }).populate('created_by')
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

app.post('/getByNameOrEmail', (req, res, next) => {
    if (req.body.name)
        Partenaire.findOne({ nom: req.body.name }).then(p => {
            res.status(201).send(p)
        })
    else if (req.body.email)
        Partenaire.findOne({ email: req.body.email }).then(p => {
            res.status(201).send(p)
        })
    else
        res.status(201).send(null)
})

app.get('/verificationCode/:code', (req, res, next) => {
    Partenaire.findOne({ code_commercial: req.params.code }).then(p => {
        if (p)
            res.status(201).send(p)
        else
            CommercialPartenaire.findOne({ code_commercial_partenaire: req.params.code }).then(c => {
                res.status(201).send(c)
            })
    })
})

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


//Modification d'un partenaire via son id
app.put("/updatePartenaire", (req, res, next) => {

    //Récupération des infos du partenaire
    const partenaireData = req.body;
    //Mise à jour du partenaire
    Partenaire.findOneAndUpdate({ _id: partenaireData._id },
        {
            user_id: partenaireData.user_id,
            nom: partenaireData.nom,
            phone: partenaireData.phone,
            email: partenaireData.email,
            number_TVA: partenaireData.number_TVA,
            SIREN: partenaireData.SIREN,
            SIRET: partenaireData.SIRET,
            format_juridique: partenaireData.format_juridique,
            type: partenaireData.type,
            APE: partenaireData.APE,
            Services: partenaireData.Services,
            Pays: partenaireData.Pays,
            WhatsApp: partenaireData.WhatsApp,
            indicatifPhone: partenaireData.indicatifPhone,
            indicatifWhatsapp: partenaireData.indicatifWhatsapp,
        })
        .then((partenaireFromDB) => {
            res.status(200).json({ message: 'Le partenaire a bien été modifié !' });
        })
        .catch((error) => {
            console.error(error)
            res.status(500).json({ 'error': 'Problème de modification, contactez un administrateur' });
        })
});
app.get('/delete/:id', (req, res) => {
    Partenaire.findById(req.params.id).then(p => {
        User.findByIdAndRemove(p.user_id, {}, (err, u) => {
            if (err)
                console.error(err)
        })
        CommercialPartenaire.find({ code_commercial_partenaire: { $regex: "^" + p.code_partenaire } }).then(commercials => {
            commercials.forEach(c => {
                User.findByIdAndRemove(c.user_id)
            })
            CommercialPartenaire.deleteMany({ code_commercial_partenaire: { $regex: "^" + p.code_partenaire } }, {}, (err, u) => {
                if (err)
                    console.error(err)
            })
        })
        Prospect.updateMany({ code_commercial: { $regex: "^" + p.code_partenaire } }, { code_commercial: "" }, {}, (err, u) => {
            if (err)
                console.error(err)
        })
        Partenaire.findByIdAndRemove(req.params.id, {}, (err, pdeleted) => {
            if (err)
                console.error(err)
            else
                res.send(pdeleted)
        })
    })
})

app.put("/newUpdate", (req, res, next) => {

    //Récupération des infos du partenaire
    const partenaireData = req.body;
    let id = partenaireData._id
    delete partenaireData._id
    //Mise à jour du partenaire
    Partenaire.findByIdAndUpdate(id,
        {
            ...partenaireData
        }, { new: true })
        .then((partenaireFromDB) => {
            res.status(200).send(partenaireFromDB);
        })
        .catch((error) => {
            console.error(error)
            res.status(500).json({ 'error': 'Problème de modification, contactez un administrateur' });
        })
});

const fs = require("fs");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let id = req.body.id;
        if (!fs.existsSync("storage/Partenaire/etat_contrat/" + id + "/")) {
            fs.mkdirSync("storage/Partenaire/etat_contrat/" + id + "/", { recursive: true });
        }
        callBack(null, "storage/Partenaire/etat_contrat/" + id + "/");
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`);
    },
});
const upload = multer({ storage: storage, limits: { fileSize: 20000000 } });
//Sauvegarde de la photo de profile
app.post("/file", upload.single("file"), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error("No File");
        error.httpStatusCode = 400;
        return next(error);
    }
    Partenaire.findById(req.body.id, (err, cp) => {
        try {
            if (fs.existsSync("storage/Partenaire/etat_contrat/" + req.body.id + "/" + cp?.pathEtatContrat))
                fs.unlinkSync("storage/Partenaire/etat_contrat/" + req.body.id + "/" + cp?.pathEtatContrat);
            //file removed
        } catch (err2) {
            console.log(err2, "Pas de fichier existant")
        }
    });
    Partenaire.findOneAndUpdate(
        { _id: req.body.id },
        {
            pathEtatContrat: file.filename,
            typeEtatContrat: file.mimetype,
        },
        (errUser, user) => {
            console.error(errUser);
            //Renvoie de la photo de profile au Front pour pouvoir l'afficher
            res.send({
                pathEtatContrat: file.filename,
                typeEtatContrat: file.mimetype,
            });
        }
    );
})

app.get("/download-contrat/:id", (req, res) => {
    Partenaire.findById(req.params.id, (err, cp) => {
        res.download(`./storage/Partenaire/etat_contrat/${req.params.id}/${cp.pathEtatContrat}`, function (err) {
            if (err) {
                res.status(400).send(err);
            }
        });
    });

});

module.exports = app;
