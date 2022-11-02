const express = require("express");
const app = express();
app.disable("x-powered-by");
const { User } = require("./../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
const multer = require('multer');
const mongoose = require("mongoose");
const fs = require("fs");
const { Formateur } = require("../models/formateur")
const { Etudiant } = require("../models/etudiant")
const { pwdToken } = require("../models/pwdToken")
const { Partenaire } = require("../models/partenaire")
const { Prospect } = require("../models/prospect")
const { Service } = require('../models/service')
const { CommercialPartenaire } = require("../models/CommercialPartenaire")





let origin = ["http://localhost:4200"]
if (process.argv[2]) {
    let argProd = process.argv[2]
    if (argProd.includes('dev')) {
        origin = ["https://t.dev.estya.com"]
    } else (
        origin = ["https://ims.estya.com", "https://ticket.estya.com", "https://estya.com", "https://adgeducations.com", "https://eduhorizons.com", "https://espic.com", "http://partenaire.eduhorizons.com", "http://login.eduhorizons.com"]
    )
}
let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'estya-ticketing@estya.com',
        pass: 'ESTYA@@2021',
    },
});




//Enregsitrement d'un nouvel user
app.post("/registre", (req, res) => {
    let data = req.body;
    User.findOne({ email: data?.email, role: "user" }, (errFO, user) => {
        if (errFO) {
            console.error(errFO)
        }
        if (user) {
            User.findOneAndUpdate({ _id: user._id },
                {
                    civilite: data.civilite,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    indicatif: data.indicatif,
                    phone: data.phone,
                    role: data.role,
                    service_id: data?.service_id || null,
                    type: data.type,
                    entreprise: data.entreprise,
                    pays_adresse: data.pays_adresse,
                    ville_adresse: data.ville_adresse,
                    rue_adresse: data.rue_adresse,
                    numero_adresse: data.numero_adresse,
                    postal_adresse: data.postal_adresse
                }, { new: true }, (err, userModified) => {
                    if (err) {
                        console.error(err)
                    } else {
                        res.send(userModified)
                    }
                })
        } else {
            let newUser = new User({
                civilite: data.civilite,
                firstname: data.firstname,
                lastname: data.lastname,
                indicatif: data.indicatif,
                phone: data.phone,
                email: data?.email,
                email_perso: data?.email,
                /*password: bcrypt.hashSync(data.password, 8),*/
                role: data.role || "user",
                service_id: data?.service_id || null,
                type: data.type,
                entreprise: data.entreprise,
                pays_adresse: data.pays_adresse,
                ville_adresse: data.ville_adresse,
                rue_adresse: data.rue_adresse,
                numero_adresse: data.numero_adresse,
                postal_adresse: data.postal_adresse,
                date_creation: new Date()
            })
            newUser.save().then((userFromDb) => {
                res.status(200).send(userFromDb);
                let gender = (userFromDb.civilite == 'Monsieur') ? 'M. ' : 'Mme ';
                let htmlmail = '<p>Bonjour ' + gender + userFromDb.lastname + ' ' + userFromDb.firstname + ', </p><p style="color:black"> <span style="color:orange">Felicitations ! </span> Votre compte E-Ticketing a été crée avec succés.</p><p style="color:black">Cordialement.</p><footer> <img  src="red"/></footer>';
                let mailOptions = {
                    from: 'estya-ticketing@estya.com',
                    to: data.email,
                    subject: 'Estya-Ticketing',
                    html: htmlmail,
                    attachments: [{
                        filename: 'signature.png',
                        path: 'assets/signature.png',
                        cid: 'red' //same cid value as in the html img src
                    }]
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.error(error);
                    }
                });
            }).catch((error) => {
                console.error(error)
                res.status(400).send(error);
            })
        }
    })
});

//Connexion d'un user
app.post("/login", (req, res) => {
    let data = req.body;
    User.findOne({
        email_perso: data.email,
    }).then((userFromDb) => {
        if (!userFromDb || !bcrypt.compareSync(data.password, userFromDb.password)) {
            console.log(userFromDb)
            console.log(bcrypt.compareSync(data.password, userFromDb.password))
            res.status(404).send({ message: "Email ou Mot de passe incorrect" });
        }
        else {
            if (userFromDb.verifedEmail) {
                let token = jwt.sign({ id: userFromDb._id, role: userFromDb.role, service_id: userFromDb.service_id, type: userFromDb.type }, "126c43168ab170ee503b686cd857032d", { expiresIn: '7d' })
                res.status(200).send({ token });
            }
            else { res.status(304).send({ message: "Compte pas activé", data }); }
        }
    }).catch((error) => {
        console.log(error)
        res.status(404).send(error);
    })
});

//Récupération d'un user via ID
app.get("/getById/:id", (req, res) => {
    let id = req.params.id;
    User.findOne({ _id: id }).then((userFromDb) => {
        let userToken = jwt.sign({ userFromDb }, "126c43168ab170ee503b686cd857032d", { expiresIn: '7d' })
        res.status(200).send({ userToken });
    }).catch((error) => {
        console.error(error)
        res.status(404).send(error);
    })
});




//Recuperation des infos user
app.get("/getInfoById/:id", (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then((userfromDb) => { res.status(200).send(userfromDb); })
        .catch((error) => { res.status(500).send('Impossible de recuperer ce utilisateur: ' + error.message); })
});

//Recuperation des infos user
app.get("/getPopulate/:id", (req, res, next) => {
    User.findOne({ _id: req.params.id }).populate("service_id")
        ?.then((userfromDb) => { res.status(200).send(userfromDb); })
        .catch((error) => { res.status(500).send('Impossible de recuperer ce utilisateur: ' + error.message); })
});


//Récupération de tous les users
app.get("/getAll", (req, res) => {
    User.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
            res.status(404).send(err);
        })
});

//Récupération de tous les users
app.get("/getNBUser", (req, res) => {
    User.find()
        .then(result => {
            res.send({ r: result.length });
        })
        .catch(err => {
            console.error(err);
            res.status(404).send(err);
        })
});

//Mise à jour d'un user
app.post("/updateById/:id", (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id },
        {
            civilite: req.body.user.civilite,
            firstname: req.body.user.firstname,
            lastname: req.body.user.lastname,
            indicatif: req.body.user.indicatif,
            phone: req.body.user.phone,
            role: req.body.user?.role,
            service_id: req.body?.user.service_id,
            entreprise: req.body?.user.entreprise,
            type: req.body.user?.type,
            pays_adresse: req.body.user.pays_adresse,
            ville_adresse: req.body.user.ville_adresse,
            rue_adresse: req.body.user.rue_adresse,
            numero_adresse: req.body.user.numero_adresse,
            postal_adresse: req.body.user.postal_adresse

        }, { new: true }, (err, user) => {
            if (err) {
                console.error(err);
                res.send(err)
            } else {
                res.send(user)
            }
        })
})


//Mise à jour d'un user
app.post("/updateByIdForPrivate/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id,
        {
            firstname: req.body.user.firstname,
            lastname: req.body.user.lastname,
            email: req.body.user.email,
            email_perso: req.body.user.email_perso,

        }, { new: true }, (err, user) => {
            if (err) {
                console.error(err);
                res.send(err)
            } else {
                res.send(user)
            }
        })
})


app.post("/ValidateEmail/:email", (req, res) => {

    User.findOneAndUpdate({ email: req.params.email },
        {
            verifedEmail: true,

        }, { new: true }, (err, user) => {
            if (err) {
                console.error(err);
                res.send(err)
            } else {
                res.status(200).send(user)
            }
        })
})


//Mise à jour d'un user
app.post("/updatePreInscrit/:id", (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id },
        {
            civilite: req.body.user.civilite,
            firstname: req.body.user.firstname,
            lastname: req.body.user.lastname,
            indicatif: req.body.user.indicatif,
            phone: req.body.user,
            role: req.body.user.role,
            service_id: req.body?.user.service_id,
            entreprise: req.body.user.entreprise,
            type: req.body.user.type,
            pays_adresse: req.body.user.pays_adresse,
            ville_adresse: req.body.user.ville_adresse,
            rue_adresse: req.body.user.rue_adresse,
            numero_adresse: req.body.user.numero_adresse,
            postal_adresse: req.body.user.postal_adresse

        }, { new: true }, (err, user) => {
            if (err) {
                console.error(err);
                res.send(err)
            } else {
                Inscription.findById(user._id, (err2, inscription) => {
                    if (inscription) {
                        //findOneAndUpdate
                        Inscription.findOneAndUpdate({ user_id: user._id },
                            {
                                classe: req.body.inscription.classe,
                                statut: req.body.inscription.statut,
                                diplome: req.body.inscription.diplome,
                                nationalite: req.body.inscription.nationalite,
                                date_naissance: req.body.inscription.date_naissance
                            }, (err3, InscriptionUpdate) => {
                                if (errInscription) {
                                    console.error(errInscription)
                                    res.send(errInscription)
                                }
                                else {
                                    res.send(InscriptionUpdate)
                                }
                            });
                    } else {
                        //new Inscription()
                        let inscrit = new Inscription({
                            user_id: user._id,
                            classe: req.body.inscription.classe,
                            statut: req.body.inscription.statut,
                            diplome: req.body.inscription.diplome,
                            nationalite: req.body.inscription.nationalite,
                            date_naissance: req.body.inscription.date_naissance
                        });

                        inscrit.save()
                            .then(() => res.status(200).send(user))
                            .catch(errSave => res.status(400).send(errSave));

                    }
                })
            }
        })
})

//Mise à jour d'un étudiant
app.post("/updateEtudiant/:id", (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id },
        {
            civilite: req.body.user.civilite,
            firstname: req.body.user.firstname,
            lastname: req.body.user.lastname,
            indicatif: req.body.user.indicatif,
            phone: req.body.user.phone,
            role: req.body.user.role,
            service_id: req.body?.user.service_id,
            entreprise: req.body.user.entreprise,
            isAlternant: req.body.user.type,
            pays_adresse: req.body.user.pays_adresse,
            ville_adresse: req.body.user.ville_adresse,
            rue_adresse: req.body.user.rue_adresse,
            numero_adresse: req.body.user.numero_adresse,
            postal_adresse: req.body.user.postal_adresse,
            statut: req.body.user.statut,
            type: req.body.user.type,
            // diplome : req.body.user.diplome

        }, { new: true }, (err, user) => {
            if (err || !user) {
                console.error(err);
                res.send(err)
            } else {
                let etudiantData = req.body.newEtudiant;
                if (etudiantData._id) {
                    Etudiant.findByIdAndUpdate(etudiantData._id, {
                        ...etudiantData
                    }, { new: true }, (err, doc) => {
                        if (!err && doc) {
                            res.status(201).json(doc)
                        } else {
                            res.status(500).json(err)
                        }
                    })
                } else {
                    delete etudiantData._id
                    let etudiant = new Etudiant(
                        {
                            ...etudiantData
                        });
                    etudiant.save()
                        .then((etudiantCreated) => { res.status(201).json({ success: 'Etudiant crée' }) })
                        .catch((error) => { res.status(500).send(error) });
                }
            }
        })
})

//Récupérer tous les users via Service ID
app.get("/getAllbyService/:id", (req, res) => {
    User.find({ service: req.params.id })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            res.status(404).send(error);
            console.error(err);
        })
});
app.get("/getAllCommercial/", (req, res) => {
    User.find({ type: "Commercial" })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            res.status(404).send(error);
            console.error(err);
        })
});

app.get("/getAllbyEmailPerso/:id", (req, res) => {

    let emailperso = req.params.id;
    User.findOne({ email_perso: emailperso }).then((userFromDb) => {
        let userToken = jwt.sign({ userFromDb }, "126c43168ab170ee503b686cd857032d", { expiresIn: '7d' })
        res.status(200).send(userToken);
    }).catch(err => {
        res.status(404).send(error);
        console.error(err);
    })
});
app.get("/getByEmail/:email", (req, res) => {

    User.findOne({ email_perso: req.params.email }).then((dataInscription) => {
        if (dataInscription) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    })
        .catch(err => {
            res.status(404).send(err);
            console.error(err);
        })
})

//Récupérer tous les non-users
app.get("/getAllAgent/", (req, res) => {
    User.find({ role: ["Responsable", "Agent", "Admin"] })

        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            res.status(404).send(error);
            console.error(err);
        })
})

//Mise à jour du mot de passe
app.post("/updatePassword/:id", (req, res) => {
    User.findById(req.params.id, (err, user) => {
        let comparer = bcrypt.compareSync(req.body.actualpassword, user.password)
        if (comparer) {
            User.findOneAndUpdate({ _id: req.params.id }, {
                password: bcrypt.hashSync(req.body.password, 8)
            }, { new: true }, (errfind, userUpdated) => {
                if (errfind) {
                    console.error(errfind);
                    res.send(errfind)
                } else {
                    res.send(userUpdated)
                }
            })
        } else {
            res.send({ error: "Pas le bon mot de passe actuel" })
        }
    })

})

//Sauvegarde de la photo de profile
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let id_photo = req.body.id
        if (!fs.existsSync('storage/profile/' + id_photo + '/')) {
            fs.mkdirSync('storage/profile/' + id_photo + '/', { recursive: true })
        }
        callBack(null, 'storage/profile/' + id_photo + '/')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 20000000 } })
//Sauvegarde de la photo de profile
app.post('/file', upload.single('file'), (req, res, next) => {
    const file = req.file;
    console.log(file)
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    User.findById(req.body.id, (err, photo) => {

        try {
            if (fs.existsSync('storage/profile/' + req.body.id + '/' + photo.pathImageProfil))
                fs.unlinkSync('storage/profile/' + req.body.id + '/' + photo.pathImageProfil)
            //file removed
        } catch (err2) {
            console.error("Un fichier n'existait pas avant")
            console.error(err2, photo)
        }
    })

    User.findOneAndUpdate({ _id: req.body.id }, {
        pathImageProfil: file.filename,
        typeImageProfil: file.mimetype
    }, (errUser, user) => {
        console.error(errUser)
        //Renvoie de la photo de profile au Front pour pouvoir l'afficher
        res.send({ message: "Photo mise à jour" });

    })
})

//Envoie de la photo de profile
app.get('/getProfilePicture/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (user && user.pathImageProfil) {
            try {
                let file = fs.readFileSync("storage/profile/" + user.id + '/' + user.pathImageProfil, { encoding: 'base64' }, (err2) => {
                    if (err2) {
                        return console.error(err2);
                    }
                });
                res.send({ file: file, documentType: user.typeImageProfil })
            } catch (e) {
                res.send({ error: e })
            }
        } else {
            res.send({ error: "Image non défini" })
        }

    })
})

app.post('/AuthMicrosoft', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {

            let token = jwt.sign({ id: user._id, role: user.role, service_id: user.service_id }, "126c43168ab170ee503b686cd857032d", { expiresIn: '7d' })
            if (!user.civilite) {
                res.status(200).send({ token, message: "Nouveau compte crée via Ticket" });
            } else {
                res.status(200).send({ token });
            }
        } else {
            let lastname = req.body.name.substring(req.body.name.indexOf(" ") + 1); //Morgan HUE
            let firstname = req.body.name.replace(" " + lastname, '')
            let newUser = new User({
                firstname: firstname,
                lastname: lastname,
                email: req.body.email,
                role: "user",
                service_id: null
            })
            newUser.save().then((userFromDb) => {

                let token = jwt.sign({ id: userFromDb._id, role: userFromDb.role, service_id: userFromDb.service_id }, "126c43168ab170ee503b686cd857032d", { expiresIn: '7d' })
                res.status(200).send({ token, message: "Nouveau compte crée" });
            }, (err2) => {
                console.error(err2)
            })
        }
    })
})

app.get("/WhatTheRole/:id", (req, res) => {
    let id = new mongoose.mongo.ObjectId(req.params.id)
    Formateur.findOne({ user_id: id }).then(f => {
        if (f && f.length != 0) {
            res.status(200).send({ data: f, type: "Formateur" })
        } else {
            Etudiant.findOne({ user_id: id }).then(a => {
                if (a && a.length != 0) {
                    res.status(200).send({ data: a, type: a.type })
                } else {
                    Etudiant.findOne({ user_id: id }).then(e => {
                        if (e && e.length != 0) {
                            res.status(200).send({ data: e, type: "Etudiant" })
                        }
                        else {
                            CommercialPartenaire.findOne({ user_id: id }).then(p => {
                                if (p && p.length != 0) {
                                    res.status(200).send({ data: p, type: "Commercial" })
                                }

                                else {
                                    Prospect.findOne({ user_id: id }).then(p => {
                                        if (p && p.length != 0) {
                                            let Ptoken = jwt.sign({ p }, '126c43168ab170ee503b686cd857032d', { expiresIn: '7d' })
                                            res.status(200).send({ data: p, type: "Prospect", Ptoken })
                                        }

                                        else {
                                            res.status(200).send({ data: null });
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

app.post("/verifyUserPassword", (req, res) => {
    let passwordToVerif = req.body.password;
    let id = req.body.id;

    console.log(passwordToVerif, ' ', id)
    User.findOne({ _id: id })
        .then((userFromDb) => {

            bcrypt.compare(passwordToVerif, userFromDb.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({ success: 'OK' });
                })
                .catch((error) => console.error(error));

        })
        .catch((error) => { console.log(error) })
});

app.post("/updatePwd/:id", (req, res) => {

    let pwd = req.body.pwd;
    console.log(req.body)
    User.findOneAndUpdate({ _id: req.params.id },
        {
            password: bcrypt.hashSync(pwd, 8),
        })
        .then((userFromDb) => {
            console.log(userFromDb)
            let token = { "id": userFromDb._id, "role": userFromDb.role, "service_id": userFromDb.service_id };

            console.log(token)
            res.status(200).send(token);
        })
        .catch((error) => { console.log(error) });
});

app.post("/pwdToken/:email", (req, res) => {

    console.log(req.params.email)
    //  let pwd_token = { 'email': req.params.email, 'date_creation': new Date() };

    let PwdToken = new pwdToken({
        email: req.params.email,
        date_creation: new Date(),
    })

    PwdToken.save().then((pwdTokFromDb) => {

        let Intedtransporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false, // true for 587, false for other ports
            requireTLS: true,
            auth: {
                user: 'noreply@intedgroup.com',
                pass: '@iNTEDgROUPE',
            },
        });
        console.log(pwdTokFromDb)
        let htmlmail = '<p>Bonjour , </p><p style="color:black">Nous avons reçu une demande de modification de mot de passe pour votre compte IMS. Si vous souhaitez poursuivre la réinitialisation de votre mot de passe, cliquez sur le lien ci-dessous ou copiez-le directement dans la barre d\'adresse de votre navigateur : </p><p style="color:black"> <a href="' + origin + '/#/mot_de_passe_reinit/' + pwdTokFromDb._id + '"> Je réinitialise mon mot de passe </a> </span>  </p><p style="color:black">Si vous n\'êtes pas l\'auteur de cette requête, ou si vous ne voulez pas réinitialiser votre mot de passe, merci de ne pas tenir compte de cet e-mail.</p><p style="color:black">En cas de questions ou de problèmes, ou si vous rencontrez des difficultés au cours de la réinitialisation de votre mot de passe, contactez nous par email sur l\'adresse email suivante : contact@intedgroup.com</p><p style="color:black">Cordialement.</p><footer> <img  src="footer_signature"/></footer>';
        let mailOptions = {
            from: 'noreply@intedgroup.com',
            to: PwdToken.email,
            subject: '[IMS] Mot de passe oublié',
            html: htmlmail,
            attachments: [{
                filename: 'logoIMS.png',
                path: 'assets/logoIMS.png',
                cid: 'footer_signature' //same cid value as in the html img src
            }]
        };
        Intedtransporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            }
        });

        res.status(200).send(pwdTokFromDb);

    }).catch((error) => {
        console.error(error)
        res.status(400).send(error);
    })
});
app.post("/reinitPwd/:pwdTokenID", (req, res) => {

    pwdToken.findOne({ _id: req.params.pwdTokenID }).then((TokenData) => {

        console.log(((new Date() - TokenData.date_creation) / 1000) / 3600)
        if ((((new Date() - TokenData.date_creation) / 1000) / 3600) < 0.25) {

            console.log("password Updated")

            User.findOneAndUpdate({ email: TokenData.email }, { password: bcrypt.hashSync(req.body.pwd, 8), }, { new: true }, (err, userModified) => {
                if (err) {
                    console.error(err)
                } else {
                    res.send(userModified)
                }
            })
        }
        else {
            console.log("Token expired")
            res.send("Token expired")
        }

    })

})
/*app.get('/TESTMAIL', (req, res) => {
    let origin = "http://localhost:4200"
    if (process.argv[2]) {
        let argProd = process.argv[2]
        if (argProd.includes('dev')) {
            origin = "https://t.dev.estya.com"
        } else (
            origin = "https://ticket.estya.com"
        )
    }
    let temp = fs.readFileSync('assets/Esty_Mailauth2.html', { encoding: "utf-8", flag: "r" })
    let temp2 = temp.replace('eMailduProSpect', "m.hue@estya.com")

    temp2 = temp2.replace('oRiGin', origin)

    temp2 = temp2.replace("\"oRiGin/", '"' + origin + "/")

    let htmlmail = fs.readFileSync('assets/Estya_Mail authetifiacation.html', { encoding: "utf-8", flag: "r" }) + temp2

    let mailOptions = {
        from: "estya-ticketing@estya.com",
        to: "m.hue@estya.com",
        subject: 'TEST EMAIL',
        html: htmlmail,
        attachments: [{
            filename: 'Image1.png',
            path: 'assets/Image1.png',
            cid: 'Image1' //same cid value as in the html img src
        }]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
            res.status(500).send(error)
        } else {
            res.status(200).send({ temp, temp2 })
        }
    });
});*/


/*app.get("/SecretPathForAbsoluteNoReason", (req, res) => {
    //Convertir l'ancienDB vers la nouvelle
    //Supprimer phone pour que tout le monde repasse par first_connection
    User.updateMany({ role: "user" }, { phone: null }).exec(data => {
        console.log(data)
        res.send(data)
    })
})*/

app.get("/HowIsIt/:id", (req, res) => {
    jwt.verify(req.header("token"), '126c43168ab170ee503b686cd857032d', function (err, decoded) {
        if (decoded == undefined) {
            res.status(201).send(err)
        } else {
            User.findById(req.params.id).then((userFromDb) => {
                if (!userFromDb) {
                    res.status(201).send({ name: "Cette utilisateur n'existe pas" })
                } else if (userFromDb.civilite == null) {
                    res.status(201).send({ name: "Profil incomplet" })
                } else {
                    res.status(201).send({ name: "Profil complet" });
                }
            }).catch((error) => {
                console.error(error)
                res.status(201).send(error);
            })
        }
    });
});

app.get('/getAllCommercialFromTeam/:id', (req, res) => {
    Service.findOne({ label: /ommercial/i }).then(s => {
        User.find({ role: "Agent", service_id: s._id }).then(u => {
            res.status(201).send(u)
        })
    })
})

app.get("/getAllCommercialV2", (req, res) => {
    Service.findOne({ label: /ommercial/i }).then(s => {
        if (s)
            User.find({ role: { $ne: 'user' }, service_id: s._id }).then(u => {
                res.status(201).send(u)
            })
        else
            res.status(500).send("Le service de commercial n'existe pas")
    })
});

module.exports = app;
