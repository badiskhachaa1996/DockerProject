const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { User } = require("./../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
const multer = require('multer');
const fs = require("fs");
const { Inscription } = require("../models/inscription");


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
    User.findOne({ email: data?.email,role:"user" }, (errFO, user) => {
        if(errFO){
            console.error(errFO)
        }
        if (user) {
            User.findOneAndUpdate({_id:user._id},
                {
                    civilite: data.civilite,
                    firstname: data.firstname,
                    lastname: data.lastname,
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
                phone: data.phone,
                email: data?.email,
                /*password: bcrypt.hashSync(data.password, 8),*/
                role: data.role || "user",
                service_id: data?.service_id || null,
                type: data.type,
                entreprise: data.entreprise,
                pays_adresse: data.pays_adresse,
                ville_adresse: data.ville_adresse,
                rue_adresse: data.rue_adresse,
                numero_adresse: data.numero_adresse,
                postal_adresse: data.postal_adresse 
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
        email: data.email,
    }).then((userFromDb) => {
        let comparer = bcrypt.compareSync(data.password, userFromDb.password);
        if (!userFromDb || !comparer) {
            res.status(404).send({ message: data });
        }
        else {
            let token = jwt.sign({ id: userFromDb._id, role: userFromDb.role, service_id: userFromDb.service_id }, "mykey")
            res.status(200).send({ token });
        }
    }).catch((error) => {
        console.error(error)
        res.status(404).send(error);
    })
});

//Récupération d'un user via ID
app.get("/getById/:id", (req, res) => {
    let id = req.params.id;
    User.findOne({ _id: id }).then((userFromDb) => {
        let userToken = jwt.sign({ userFromDb }, "userData")
        res.status(200).send({ userToken });
    }).catch((error) => {
        console.error(error)
        res.status(404).send(error);
    })
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

//Mise à jour d'un user
app.post("/updateById/:id", (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id },
        {
            civilite: req.body.user.civilite,
            firstname: req.body.user.firstname,
            lastname: req.body.user.lastname,
            phone: req.body.user.phone,
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
                Inscription.findById(user._id,(err,inscription)=>{
                    if(inscription){
                        //findOneAndUpdate
                        Inscription.findOneAndUpdate({user_id: user._id},
                            {
                                classe: req.body.inscription.classe,
                                statut: req.body.inscription.statut,
                                diplome: req.body.inscription.diplome,
                                nationalite: req.body.inscription.nationalite,
                                date_de_naissance: req.body.inscription.date_de_naissance
                            },(err,InscriptionUpdate)=>{
                                if(errInscription){
                                    console.log(errInscription)
                                    res.send(errInscription)
                                }
                                else{
                                    res.send(InscriptionUpdate)
                                }
                            });
                    }else{
                        //new Inscription()
                        let inscrit = new Inscription({
                            user_id : user._id,
                            classe: req.body.inscription.classe,
                            statut: req.body.inscription.statut,
                            diplome: req.body.inscription.diplome,
                            nationalite: req.body.inscription.nationalite,
                            date_de_naissance: req.body.inscription.date_de_naissance
                        });

                        inscrit.save()
                        .then(() => res.status(200).send(user))
                        .catch(errSave => res.status(400).send(errSave));

                    }
                })
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

app.get("/getAllbyEmailPerso/:id", (req, res) => {
    User.find({ email_perso: req.params.id })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            res.status(404).send(error);
            console.error(err);
        })
});

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
            }, { new: true }, (errfind, user) => {
                if (errfind) {
                    console.error(errfind);
                    res.send(errfind)
                } else {
                    res.send(user)
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
        callBack(null, 'storage/profile/')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

//Sauvegarde de la photo de profile
app.post('/file', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    User.findById(req.body.id, (err, photo) => {
        try {
            fs.unlinkSync('storage/profile/' + photo.pathImageProfil)
            //file removed
        } catch (err) {
            console.error(err)
        }
    })
    User.findOneAndUpdate({ _id: req.body.id }, {
        pathImageProfil: file.filename,
        typeImageProfil: file.mimetype
    }, (errUser, user) => {
        //Renvoie de la photo de profile au Front pour pouvoir l'afficher
        res.send({ message: "Photo mise à jour" });

    })
})

//Envoie de la photo de profile
app.get('/getProfilePicture/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (user && user.pathImageProfil) {
            try {
                let file = fs.readFileSync("storage/profile/" + user.pathImageProfil, { encoding: 'base64' }, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                });
                res.send({ file: file, documentType: user.typeImageProfil })
            } catch (e) {
                res.send({ error: "Image non trouvé" })
            }
        } else {
            res.send({ error: "Image non défini" })
        }

    })
})

app.post('/AuthMicrosoft', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
            let token = jwt.sign({ id: user._id, role: user.role, service_id: user.service_id }, "mykey")
            if(user.type==null || user.phone==null){
                res.status(200).send({ token, message: "Nouveau compte crée via Ticket" });
            }else{
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
                let token = jwt.sign({ id: userFromDb._id, role: userFromDb.role, service_id: userFromDb.service_id }, "mykey")
                res.status(200).send({ token, message: "Nouveau compte crée" });
            })
        }
    })
})

module.exports = app;
