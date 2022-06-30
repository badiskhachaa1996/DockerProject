const express = require('express');
const app = express();
app.disabled("x-powered-by");
const { Prospect } = require('../models/prospect');
const { CommercialPartenaire } = require('../models/CommercialPartenaire');
const { User } = require('./../models/user');
const { Partenaire } = require("../models/partenaire")
const fs = require("fs");
const origin = require("../config");
const path = require('path');
var mime = require('mime-types')
const jwt = require("jsonwebtoken");

const multer = require('multer');
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
// initialiser transporteur de nodeMailer
let transporterEstya = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'admission@estya.com',
        pass: 'ADMIelite19',
    },
});
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

let transporterEspic = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'admission@espic.com',
        pass: 'ESPIC@@2022ims',
    },
});

let transporterAdg = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'admission@adgeducation.com',
        pass: 'ADG@@2022ims',
    },
});

//Creation d'un nouveau prospect
app.post("/create", (req, res, next) => {

    //Recuperation de nos datas depuis la requete
    prospectData = req.body.newProspect;
    userData = req.body.newUser;

    //Suppression du _id venant du frontend
    delete prospectData._id;

    //Création du nouvel objet prospect et du nouvel objet user
    const prospect = new Prospect({
        ...prospectData
    });
    let r = userData.firstname.substring(0, 3) + "@" + (Math.random() + 1).toString(16).substring(7).replace(' ', '');
    console.log("random", r);
    const user = new User(
        {
            civilite: userData.civilite,
            firstname: userData.firstname,
            lastname: userData.lastname,
            phone: userData.phone,
            indicatif: userData.indicatif,
            email: userData.email_perso,
            email_perso: userData.email_perso,
            password: bcrypt.hashSync(r, 8),
            role: userData.role,
            service_id: null,
            type: "Prospect",
            entreprise: userData.entreprise,
            pays_adresse: userData.pays_adresse,
            ville_adresse: userData.ville_adresse,
            rue_adresse: userData.rue_adresse,
            numero_adresse: userData.numero_adresse,
            postal_adresse: userData.postal_adresse,
            nationnalite: userData.nationnalite,
            verifedEmail: false,
        });



    //Vérification de l'existence de l'utilisateur via l'email perso
    User.findOne({ email_perso: userData.email_perso })
        .then((userFromDb) => {
            if (userFromDb) {
                Prospect.findOne({ user_id: userFromDb._id })
                    .then((prospectFromDb) => {
                        if (prospectFromDb) {
                            res.status(201).json({ error: 'Ce prospect existe déjà !' });
                        } else {
                            prospect.user_id = userFromDb._id;
                            prospect.save()
                                .then((prospectSaved) => {
                                    let token = jwt.sign({ id: userFromDb._id, role: userFromDb.role, service_id: userFromDb.service_id }, "mykey")
                                    res.status(201).json({ success: 'Prospect ajouté dans la BD', dataUser: userFromDb, token });
                                })
                                .catch((error) => { res.status(400).json({ error: 'Impossible d\ajouter ce prospect' }) });
                        }

                    })
                    .catch((error) => { res.status(400).json({ error: "Impossible de verifier l'existence du prospect" }); });
            }
            else {
                user.save()
                    .then((userCreated) => {
                        prospect.user_id = userCreated._id;
                        console.log(userCreated)
                        let token = jwt.sign({ id: userCreated._id, role: userCreated.role, service_id: userCreated.service_id }, "mykey")
                        console.log(token)
                        prospect.save()
                            .then((prospectSaved) => {
                                res.status(201).json({ success: 'Prospect crée', dataUser: userCreated, token: token });
                                console.log(prospectSaved.type_form)

                                if (prospectSaved.type_form == "estya") {
                                    let temp = fs.readFileSync('assets/Esty_Mailauth2.html', { encoding: "utf-8", flag: "r" })
                                    temp = temp.replace('eMailduProSpect', userCreated.email_perso)

                                    temp = temp.replace('oRiGin', origin)

                                    temp = temp.replace("\"oRiGin/", '"' + origin + "/")

                                    let htmlmail = fs.readFileSync('assets/Estya_Mail authetifiacation.html', { encoding: "utf-8", flag: "r" }) + r + temp

                                    let mailOptions = {
                                        from: "admission@estya.com",
                                        to: userCreated.email_perso,
                                        subject: 'Confirmation de préinscription',
                                        html: htmlmail,
                                        attachments: [{
                                            filename: 'Image1.png',
                                            path: 'assets/Image1.png',
                                            cid: 'Image1' //same cid value as in the html img src
                                        }]
                                    };

                                    transporterEstya.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            console.error(error);

                                        }
                                        console.log(info)


                                    });

                                }
                                else if (prospectSaved.type_form == "eduhorizons") {


                                    let htmlmail =
                                        "<p>Bonjour,</p><p>Votre demande d'inscription sur notre plateforme a été enregistré avec succès, merci de connecter avec votre mail et votre mot de passe : <strong> " +
                                        r + "</strong>  sur <a href=\"" + origin + "/suivrePreinscription\">ce lien</a> </p>" +
                                        "<p> Afin d'entamer l'étude de votre dossier veuillez suivre les étapes suivantes : </p>" +
                                        "<ul><li><p ><span style=\"color: rgb(36, 36, 36);font-weight: bolder;\"> Activer Votre compte et valider votre email en cliquant sur" +
                                        " <a href=\"" + origin + "/validation-email/" + userCreated.email_perso + "\">J\'active mon compte IMS</a></span></p> " +
                                        "</li><li>S'authentifier avec vos coordonnées sur le portail. </li>" +
                                        " <li>Déposer votre dossier de candidature </li>" +
                                        " <li>Suivre l'état d'avancement sur le portail</li>" +
                                        " </ul>" +
                                        "<p>Si vous aurez des difficultés de charger vos documents, vous pouvez les envoyer directement sur l'adresse mail <a href=\"mailto:contact@eduhorizons.com\">contact@eduhorizons.com</a></p>" +
                                        "<p>Ainsi, pour d'autres demandes d'informations, vous pouvez nous contacter sur notre WhatsApp : +33 188880659 </p>" +
                                        "<p> <br />On reste à votre disposition pour tout complément d'information. </p>" +
                                        " <p>Bien cordialement.</p>" +
                                        "<p><img src ='cid:SignatureEmailEH' alt=\" \" width='520' height='227' /></p>";


                                    let mailOptions = {
                                        from: "contact@eduhorizons.com",
                                        to: userCreated.email_perso,
                                        subject: 'Confirmation de préinscription',
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

                                }
                                else if (prospectSaved.type_form == "espic") {

                                    let htmlmail =
                                        "<p>Bonjour,</p><p>Votre demande d'inscription sur notre plateforme a été enregistré avec succès, merci de connecter avec votre mail et votre mot de passe : <strong> " +
                                        r + "</strong>  sur <a href=\"" + origin + "/suivrePreinscription\">ce lien</a> </p>" +
                                        "<p> Afin d'entamer l'étude de votre dossier veuillez suivre les étapes suivantes :</p>" +
                                        "<ul><li>" +
                                        "<p><span style=\"color: rgb(36, 36, 36);font-weight: bolder;\"> Activer Votre compte et valider votre email en cliquant sur" +
                                        " <a href=\"" + origin + "/validation-email/" + userCreated.email_perso + "\">J\'active mon compte IMS</a></span></p> " +
                                        "</li><li>S'authentifier avec vos coordonnées sur le portail. </li>" +
                                        " <li>Déposer votre dossier de candidature </li>" +
                                        " <li>Suivre l'état d'avancement sur le portail</li>" +
                                        " </ul>" +
                                        "<p>Si vous aurez des difficultés de charger vos documents, vous pouvez les envoyer directement sur l'adresse mail <a href=\"mailto:admission@espic.com\">admission@espic.com</a></p>" +
                                        "<p>Ainsi, pour d'autres demandes d'informations, vous pouvez nous contacter sur notre WhatsApp : +33 188880659 </p>" +
                                        "<p> <br />On reste à votre disposition pour tout complément d'information. </p>" +
                                        " <p>Bien cordialement.</p>" /*+
                                    "<p><img src =''alt=\" \" width='620' height='227' /></p>"*/
                                    let mailOptions = {
                                        from: "admission@espic.com",
                                        to: userCreated.email_perso,
                                        subject: 'Confirmation de préinscription',
                                        html: htmlmail,
                                        /* attachments: [{
                                             filename: 'EUsign.png',
                                             path: 'assets/EUsign.png',
                                             cid: 'red' //same cid value as in the html img src
                                         }] */
                                    };
                                    transporterEspic.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            console.error(error);

                                        }
                                        console.log(info)


                                    });

                                }
                                else if (prospectSaved.type_form == "adg") {



                                    let htmlmail = "<div> <p>Bonjour, </p> </div>   <div>" +
                                        "<p> Bienvenue au Service des inscriptions de l'ADG.</p ></div >" +
                                        "<div><p>Votre demande d'inscription sur notre plateforme a été; enregistré avec succès," +
                                        "  merci de connecter avec votre mail et votre mot de passe : <strong> " +
                                        r + "</strong>  sur <a href=\"" + origin + "/suivrePreinscription\">ce lien</a> </p></div>" +
                                        "<p><span style=\"color: rgb(36, 36, 36);font-weight: bolder;\"> Activer Votre compte et valider votre email en cliquant sur" +
                                        " <a href=\"" + origin + "/validation-email/" + userCreated.email_perso + "\">J\'active mon compte IMS</a></span></p> " +
                                        "<div><p>Ci-après les critères d'admission et les documents nécessaires à nous communiquer afin d'entamer l'étude de votre candidature : </p>" +
                                        "</div><div><p> <br /> </p></div><div><ol start='1'><li>   <p>Critères d'admission :</p></li> </ol> </div><div>" +
                                        "<p> <br /> </p></div> <div><ul><li><p>Niveau linguistique : Eligible de faire le cursus en français. </p>" +
                                        "</li><li> <p>Parcours académique : Cursus antérieur correspondant à la formation choisie. </p></li><li>" +
                                        "<p>Rupture d'étude : les années précédentes sont justifiées. </p> </li></ul></div><div><p> <br /> </p></div>" +
                                        "<div><ol start='2'><li><p>Documents demander doivent &ecirc;tre traduit en français et envoyé en format PDF : <br /> </p></li>" +
                                        "</ol></div><div><ul><li><p>Pièce d'identité (passeport pour les non-résidents) (obligatoire).</p></li><li>" +
                                        "<p>Dernier dipl&ocirc;me obtenu (obligatoire).</p></li><li><p>Relevés de notes des deux dernières années (obligatoire).</p></li><li>" +
                                        "<p>Test de français : TCF B2 valide (moins de 2 ans), DELF B2 ou DALF (C1 ou C2) : obligatoire pour les étudiants non Francophones Obligatoire).</p>" +
                                        "</li><li><p>CV (obligatoire).</p></li><li><p>Lettre de motivation dans laquelle vous expliquer votre choix de formation et de campus pour lequel vous voulez candidater [Paris ou Montpellier] (obligatoire).</p>" +
                                        "</li><li><p>Attestations de travail (Si vous avez une expérience professionnelle).</p></li><li><p>Attestation de niveau en anglais (optionnel).</p>" +
                                        "</li><li><p>Certifications professionnelles (optionnel). </p></li></ul></div><div> </div><div>" +
                                        "<p>Si vous aurez des difficultés de charger vos documents, vous pouvez les envoyer directement sur l'adresse mail <a href=\"mailto:admission@adgeducation.com\">admission@adgeducation.com</a> </p>" +
                                        "</div><div> </div><div><p>En vous souhaitant bonne chance pour le reste de votre démarche consulaire, nous restons à votre disposition pour toute information complémentaire.</p></div>" +
                                        "<div><p>  </p></div><div><p>Cordialement, </p></div><div> </div><div> </div>"



                                    let mailOptions = {
                                        from: "admission@adgeducation.com",
                                        to: userCreated.email_perso,
                                        subject: 'Confirmation de préinscription',
                                        html: htmlmail,
                                        /* attachments: [{
                                             filename: 'EUsign.png',
                                             path: 'assets/EUsign.png',
                                             cid: 'red' //same cid value as in the html img src
                                         }] */
                                    };
                                    transporterAdg.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            console.error(error);

                                        }
                                        console.log('email sent!!!')


                                    });
                                }
                            })
                            .catch((error) => { res.status(400).send({ message: 'Impossible de créer un nouveau prospect !', error }) });
                    })
                    .catch((error) => { res.status(400).send({ message: 'Impossible de créer un nouvel utilisateur !', error }) });
            }
        })
        .catch((error) => { res.status(500).json({ error: 'Impossible de verifier l\'existence de l\'utilisateur ' }) });

});


//Recuperation de la liste des prospect
app.get("/getAll", (req, res, next) => {
    Prospect.find({ archived: [false,null] })//.populate('user_id')
        .then((prospectsFromDb) => {
            prospectsFromDb.forEach(function (element, index) {
                let nb = 0
                try {
                    let fileList = fs.readdirSync('./storage/prospect/' + element._id + "/")
                    fileList.forEach(file => {
                        if (!fs.lstatSync('./storage/prospect/' + element._id + "/" + file).isDirectory()) {
                            nb += 1
                        }
                        else {
                            let files = fs.readdirSync('./storage/prospect/' + element._id + "/" + file)
                            files.forEach(f => {
                                nb += 1
                            });
                        }
                    });
                } catch (e) {
                    if (e.code != "ENOENT") {
                        console.error(e)
                    }
                }
                prospectsFromDb[index]["nbDoc"] = nb
            });
            res.status(201).send(prospectsFromDb)
        })
        .catch((error) => { res.status(500).send(error.message); });
});


//Recuperation de la liste des prospects via une école
app.get("/getAllBySchool/:school", (req, res, next) => {
    Prospect.find({ school: req.params.school })
        .then((prospectsFromDb) => { res.status(200).send(prospectsFromDb) })
        .catch((error) => { res.status(500).send(error.message) });
});


//Mise à jour d'un prospect
app.put("/update", (req, res, next) => {

    prospectData = req.body.prospect;
    userData = req.body.user;

    Prospect.findOneAndUpdate({ _id: prospectData._id },
        {
            ...prospectData
        })
        .then((prospectUpdated) => {
            User.findOneAndUpdate({ _id: userData._id },
                {
                    civilite: userData.civilite,
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    phone: userData.phone,
                    email: userData.email,
                    password: bcrypt.hashSync(prospectUpdated.password, 8),
                    role: userData.role,
                    service_id: null,
                    type: userData.type,
                    entreprise: userData.entreprise,
                    pays_adresse: userData.pays_adresse,
                    ville_adresse: userData.ville_adresse,
                    rue_adresse: userData.rue_adresse,
                    numero_adresse: userData.numero_adresse,
                    postal_adresse: userData.postal_adresse,
                    nationalite: userData.nationalite,
                })
                .then((userUpdated) => { res.status(200).send(userUpdated) })
                .catch((error) => { res.status(400).send(error); });
        })
        .catch((error) => { res.status(400).send(error.message); })
});


// //Mise à jour d'un prospect via un id user à voir si utile decommenter
// app.put("/updateByIdUser", (req, res, next) => {
//     //recuperation des données reçu du formulaire

//     Prospect.findOneAndUpdate({ user_id: req.params.id },
//             {

//             })
//             .then((prospectUpdated) => { res.status(200).send(prospectUpdated)})
//             .catch((error) => { res.status(400).send(error.message); })
// });
app.post("/updateStatut/:id", (req, res, next) => {
    let d = new Date()
    //let document_manquant = req.body.document_manquant
    Prospect.findByIdAndUpdate(req.params.id, {
        statut_dossier: req.body.statut_dossier,
        tcf: req.body.tcf,
        date_traitement: d,
        agent_id: req.body.agent_id,
        decision_admission: req.body.decision_admission,
        phase_complementaire: req.body.phase_complementaire,
        statut_payement: req.body.statut_payement,
        customid: req.body.customid,
        traited_by: req.body.traited_by
    }).then(newProspect => {
        res.status(200).send(newProspect)
    }).catch((error) => { res.status(400).send(error); });
})

//


app.get("/ValidateEmail/:email", (req, res) => {

    console.log(origin);
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




app.get("/getFilesInscri/:id", (req, res) => {
    // recupére*
    console.log(origin)
    let filesTosend = [];
    fs.readdir('./storage/prospect/' + req.params.id + "/", (err, files) => {

        if (!err) {
            files.forEach(file => {
                if (!fs.lstatSync('./storage/prospect/' + req.params.id + "/" + file).isDirectory()) {
                    filesTosend.push(file)
                }
                else {
                    let files = fs.readdirSync('./storage/prospect/' + req.params.id + "/" + file)
                    if (!err) {
                        files.forEach(f => {
                            filesTosend.push(file + "/" + f)
                        });
                    }
                }
            });
        }
        res.status(200).send(filesTosend);
    }, (error) => (console.log(error)))
})

app.get("/downloadFile/:id/:directory/:filename", (req, res) => {
    let pathFile = "storage/prospect/" + req.params.id + "/" + req.params.directory + "/" + req.params.filename
    let file = fs.readFileSync(pathFile, { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    res.status(200).send({ file: file, documentType: mime.contentType(path.extname(pathFile)) })

});


app.get("/deleteFile/:id/:directory/:filename", (req, res) => {
    let pathFile = "storage/prospect/" + req.params.id + "/" + req.params.directory + "/" + req.params.filename
    try {
        fs.unlinkSync(pathFile)
    } catch (err) {
        console.error(err)
        res.status(400).send(err)
    }
    res.status(200).send()

});




const storage = multer.diskStorage({
    destination: (req, file, callBack) => {

        console.log(req.body.document)
        if (!fs.existsSync('storage/prospect/' + req.body.id + '/' + req.body.document + '/')) {
            fs.mkdirSync('storage/prospect/' + req.body.id + '/' + req.body.document + '/', { recursive: true })
        }
        callBack(null, 'storage/prospect/' + req.body.id + '/' + req.body.document + '/')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 20000000 } })

app.post('/uploadFile/:id', upload.single('file'), (req, res, next) => {

    console.log(req.params.id)
    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        res.status(400).send(error)
    } else {

        res.status(201).json({ dossier: "dossier mise à jour" });
    }

}, (error) => { res.status(500).send(error); })

app.get("/getAllByCodeAdmin/:id_partenaire", (req, res, next) => {
    Partenaire.findOne({ _id: req.params.id_partenaire })
        .then((partenaireFromDB) => {
            if (partenaireFromDB) {
                Prospect.find().then(prospects => {
                    CommercialPartenaire.find({ partenaire_id: partenaireFromDB._id }).then(commercials => {
                        let listProspects = []
                        commercials.forEach(c => {
                            prospects.forEach(p => {
                                if (p.code_commercial == c.code_commercial_partenaire) {
                                    let nb = 0
                                    try {
                                        let fileList = fs.readdirSync('./storage/prospect/' + p._id + "/")
                                        fileList.forEach(file => {
                                            if (!fs.lstatSync('./storage/prospect/' + p._id + "/" + file).isDirectory()) {
                                                nb += 1
                                            }
                                            else {
                                                let files = fs.readdirSync('./storage/prospect/' + p._id + "/" + file)
                                                files.forEach(f => {
                                                    nb += 1
                                                });
                                            }
                                        });
                                    } catch (e) {
                                        if (e.code != "ENOENT") {
                                            console.error(e)
                                        }
                                    }
                                    p["nbDoc"] = nb
                                    listProspects.push(p)
                                }
                            })
                        })
                        res.status(200).send(listProspects)
                    })
                })
            } else {
                res.status(400).send("Code incorrect, Aucun partenaire trouvé");
            }
        })
        .catch((error) => { res.status(500).send(error); });
})

app.get("/getAllByCodeCommercial/:code_partenaire", (req, res, next) => {
    console.log(req.params.code_partenaire)
    Prospect.find({ code_commercial: req.params.code_partenaire }).then(prospects => {
        prospects.forEach(function (element, index) {
            let nb = 0
            try {
                let fileList = fs.readdirSync('./storage/prospect/' + element._id + "/")
                fileList.forEach(file => {
                    if (!fs.lstatSync('./storage/prospect/' + element._id + "/" + file).isDirectory()) {
                        nb += 1
                    }
                    else {
                        let files = fs.readdirSync('./storage/prospect/' + element._id + "/" + file)
                        files.forEach(f => {
                            nb += 1
                        });
                    }
                });
            } catch (e) {
                if (e.code != "ENOENT") {
                    console.error(e)
                }
            }
            prospects[index]["nbDoc"] = nb
        });
        res.send(prospects)
    }).catch((error) => { res.status(500).send(error); });
})

app.get('/getAllWait', (req, res, next) => {
    Prospect.find({ decision_admission: "Payée", archived: [false,null] }).then(prospects => {
        prospects.forEach(function (element, index) {
            let nb = 0
            try {
                let fileList = fs.readdirSync('./storage/prospect/' + element._id + "/")
                fileList.forEach(file => {
                    if (!fs.lstatSync('./storage/prospect/' + element._id + "/" + file).isDirectory()) {
                        nb += 1
                    }
                    else {
                        let files = fs.readdirSync('./storage/prospect/' + element._id + "/" + file)
                        files.forEach(f => {
                            nb += 1
                        });
                    }
                });
            } catch (e) {
                if (e.code != "ENOENT") {
                    console.error(e)
                }
            }
            prospects[index]["nbDoc"] = nb
        });
        res.send(prospects)
    }).catch((error) => { res.status(500).send(error); });
})

//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;