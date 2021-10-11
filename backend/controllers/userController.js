const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { User } = require("./../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
const multer = require('multer');
const fs = require("fs")


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
    User.findOne({ email: data?.email,role:"user" }, (err, user) => {
        if (user) {
            User.findOneAndUpdate({_id:user._id},
                {
                    civilite: data.civilite,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    phone: data.phone,
                    adresse: data.adresse,
                    role: data.role,
                    service_id: data?.service_id || null,
                    entreprise:req.body?.entreprise,
                    type:req.body?.type,
                    formation:req.body?.formation,
                    campus:req.body?.campus
                }, { new: true }, (err, userModified) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.send(userModified)
                    }
                })
        } else {
            let user = new User({
                civilite: data.civilite,
                firstname: data.firstname,
                lastname: data.lastname,
                phone: data.phone,
                adresse: data.adresse,
                email: data?.email,
                /*password: bcrypt.hashSync(data.password, 8),*/
                role: data.role || "user",
                service_id: data?.service_id || null,
                entreprise:req.body?.entreprise,
                type:req.body?.type,
                formation:req.body?.formation,
                campus:req.body?.campus
            })
            user.save().then((userFromDb) => {
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
                        console.log(error);
                    } else {
                        console.log("Email envoyé\nà " + userFromDb.email + "\nRaison:Création de compte")
                    }
                });
            }).catch((error) => {
                console.log(error)
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
        comparer = bcrypt.compareSync(data.password, userFromDb.password);
        if (!userFromDb || !comparer) {
            res.status(404).send({ message: data });
        }
        else {
            let token = jwt.sign({ id: userFromDb._id, role: userFromDb.role, service_id: userFromDb.service_id }, "mykey")
            res.status(200).send({ token });
        }
    }).catch((error) => {
        console.log(error)
        res.status(404).send(error);
    })
});

//Récupération d'un user via ID
app.post("/getById/:id", (req, res) => {
    let id = req.params.id;
    User.findOne({ _id: id }).then((userFromDb) => {
        let userToken = jwt.sign({ userFromDb }, "userData")
        res.status(200).send({ userToken });
    }).catch((error) => {
        console.log(error)
        res.status(404).send(error);
    })
});

//Récupération de tous les users
app.post("/getAll", (req, res) => {
    User.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.log(err);
            res.status(404).send(error);
        })
});

//Mise à jour d'un user
app.post("/updateById/:id", (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id },
        {
            civilite: req.body.civilite,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            role: req.body.role,
            adresse: req.body.adresse,
            service_id: req.body.service_id,
            entreprise:req.body?.entreprise,
            type:req.body?.type,
            formation:req.body?.formation,
            campus:req.body?.campus

        }, { new: true }, (err, user) => {
            if (err) {
                console.log(err);
                res.send(err)
            } else {
                res.send(user)
            }
        })
})

//Récupérer tous les users via Service ID
app.post("/getAllbyService/:id", (req, res) => {
    User.find({ service: req.params.id })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            res.status(404).send(error);
            console.log(err);
        })
});

//Récupérer tous les non-users
app.post("/getAllAgent/", (req, res) => {
    User.find({ role: ["Responsable", "Agent", "Admin"] })

        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            res.status(404).send(error);
            console.log(err);
        })
})

//Mise à jour du mot de passe
app.post("/updatePassword/:id", (req, res) => {
    User.findById(req.params.id, (err, user) => {
        comparer = bcrypt.compareSync(req.body.actualpassword, user.password)
        if (comparer) {
            User.findOneAndUpdate({ _id: req.params.id }, {
                password: bcrypt.hashSync(req.body.password, 8)
            }, { new: true }, (err, user) => {
                if (err) {
                    console.log(err);
                    res.send(err)
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
    }, (err, user) => {
        //Renvoie de la photo de profile au Front pour pouvoir l'afficher
        res.send({ message: "Photo mise à jour" });

    })

})

//Envoie de la photo de profile
app.post('/getProfilePicture/:id', (req, res) => {
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
            if(user.type==null ||user.adresse==null || user.phone==null){
                res.status(200).send({ token, message: "Nouveau compte crée via Ticket" });
            }else{
                res.status(200).send({ token });
            }
        } else {
            let lastname = req.body.name.substring(req.body.name.indexOf(" ") + 1); //Morgan HUE
            let firstname = req.body.name.replace(" " + lastname, '')
            let user = new User({
                firstname: firstname,
                lastname: lastname,
                email: req.body.email,
                role: "user",
                service_id: null
            })
            user.save().then((userFromDb) => {
                let token = jwt.sign({ id: userFromDb._id, role: userFromDb.role, service_id: userFromDb.service_id }, "mykey")
                res.status(200).send({ token, message: "Nouveau compte crée" });
            })
        }
    })
})

module.exports = app;
