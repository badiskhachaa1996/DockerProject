const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
app.disable("x-powered-by");
const { Formateur } = require('./../models/formateur');
const { Presence } = require('./../models/presence');
const { User } = require('./../models/user');
const { RemarqueFacture } = require('./../models/remarqueFacture')
const fs = require("fs");
const path = require('path');
var mime = require('mime-types');
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

//Recupère la liste des formateurs
app.get("/getAll", (req, res, next) => {
    Formateur.find()
        .then((formateursFromDb) => { res.status(200).send(formateursFromDb) })
        .catch((error) => { res.status(500).json({ error: "Impossible de recuperer la liste des formateur " + error.Message }) })
});

//Recupère la liste des formateurs
app.get("/getAllPopulate", (req, res, next) => {
    Formateur.find().populate('user_id').populate('prestataire_id')
        .then((formateursFromDb) => { res.status(200).send(formateursFromDb) })
        .catch((error) => { res.status(500).json({ error: "Impossible de recuperer la liste des formateur " + error.Message }) })
});

//Recupère la liste d'un formateur via un id formateur
app.get("/getById/:id", (req, res, next) => {
    Formateur.findById(req.params.id)
        .then((formateurFromDb) => { res.status(200).send(formateurFromDb) })
        .catch((error) => { res.status(400).json({ error: "Impossible de recuperer ce formateur via son id " + error }) });
});

//Recupère un formateur via un userId
app.get("/getByUserId/:id", (req, res, next) => {
    if (req.params.id != "null")
        Formateur.findOne({ user_id: req.params.id })
            .then((formateurFromDb) => { res.status(200).send(formateurFromDb) })
            .catch((error) => { res.status(400).json({ error: "Impossible de recuperer cet formateur via son userId " + error.message }) });
    else {
        res.status(200).send(null)
    }
})

//Récupère le dictionaire id:formateur
app.get("/getAllUser", (req, res, next) => {
    var dicformateur = {};
    Formateur.find()
        .then((formateurList) => {
            User.find().then((UserList) => {
                var dicUser = {};

                UserList.forEach(formateur => {
                    dicUser[formateur._id] = formateur
                })
                formateurList.forEach(formateur => {
                    dicformateur[formateur._id] = dicUser[formateur.user_id]
                })
                res.status(200).send(dicformateur)
            }).catch((error) => {
                console.error(error)
                res.status(400).json({ error: "Impossible de recuperer les users" + error.message })
            });
        })
        .catch((error) => {
            console.error(error)
            res.status(400).json({ error: "Impossible de recuperer les users" + error.message })
        });
})

//Création d'un nouveau formateur et d'un nouveau user par la même occasion
app.post("/create", (req, res, next) => {

    //Création d'un nouvel objet formateur
    let data = req.body.newFormateur;
    delete data._id;
    let formateur = new Formateur(
        {
            ...data
        });

    //Creation du nouveau user
    let userData = req.body.newUser;
    let user = new User(
        {
            civilite: userData.civilite,
            firstname: userData.firstname,
            lastname: userData.lastname,
            indicatif: userData.indicatif,
            phone: userData.phone,
            email: userData.email,
            /*password: bcrypt.hashSync(data.password, 8),*/
            role: userData.role,
            service_id: null,
            type: "Formateur",
            entreprise: userData.entreprise,
            pays_adresse: userData.pays_adresse,
            ville_adresse: userData.ville_adresse,
            rue_adresse: userData.rue_adresse,
            numero_adresse: userData.numero_adresse,
            postal_adresse: userData.postal_adresse,
            date_creation: new Date()
        });

    //Verification de l'existence de l'Utilisateur
    User.findOne({ email: userData.email })
        .then((userFromDb) => {
            if (userFromDb) {
                Formateur.findOne({ user_id: userFromDb._id })
                    .then((formateurFromDb) => {
                        if (formateurFromDb) {
                            res.status(201).json({ error: 'Ce formateur existe déja' });
                        } else {
                            formateur.user_id = userFromDb._id;
                            formateur.save()
                                .then((formateurSaved) => { res.status(201).json({ success: "Formateur ajouté dans la BD!", data: formateurSaved, dataUser: userFromDb }) })
                                .catch((error) => { res.status(400).json({ msg: "Impossible d'ajouter ce formateur ", error }) });

                        }
                    })
                    .catch((error) => { res.status(400).json({ error: "Impossible de verifier l'existence du formateur" }) });
            }
            else {
                user.save()
                    .then((userCreated) => {
                        formateur.user_id = userCreated._id;
                        formateur.save()
                            .then((formateurCreated) => { res.status(201).json({ success: 'Formateur crée', data: formateurCreated, dataUser: userCreated }) })
                            .catch((error) => {
                                console.error(error)
                                res.status(400).json({ msg: 'Impossible de crée ce formateur', error })
                            });
                    })
                    .catch((error) => { res.status(400).json({ error: 'Impossible de créer un nouvel utilisateur ' + error.message }) });
            }
        })
        .catch((error) => { res.status(500).json({ error: 'Impossible de verifier l\'existence de l\'utilisateur ' }) });
});

//Modification d'un formateur via son id formateur
app.post('/updateById/:id', (req, res, next) => {
    Formateur.findOneAndUpdate({ _id: req.params.id },
        {
            ...req.body
        }, { new: true }, (err, formateurUpdated) => {
            if (err) {
                console.error(err)
                res.send(err)
            }
            else {
                res.send(formateurUpdated)
            }
        });
});

app.post('/updateVolume/:id', (req, res, next) => {
    Formateur.findById(req.params.id).then(data => {
        var VH = data.volume_h_consomme
        var nb = 1
        if (VH[req.body._id]) {
            VH[req.body._id] = +nb
        } else {
            VH[req.body._id] = nb
        }

        Formateur.findOneAndUpdate({ _id: req.params.id },
            {
                volume_h_consomme: VH
            }, { new: true }, (err, formateurUpdated) => {
                if (err) {
                    res.send(err)
                }
                else {
                    res.send(formateurUpdated)
                }
            });
    })
});

app.post('/sendEDT/:id/:update', (req, res, next) => {
    let msg = "Votre emploi du temps est disponible"
    if (req.params.update == "YES") {
        msg = "Votre emploi du temps a été modifier\nVeuillez verifier les changements\nDésolé de la gêne occasionnée"
    }
    Formateur.findById(req.params.id).then(formateur => {
        let url = '<a href="' + origin[0] + '/calendrier/formateur/' + req.params.id + '">Voir mon emploi du temps</a>'
        let htmlmail = '<p style="color:black">Bonjour,\n' + msg + "</p>"
            + url + '</p><p style="color:black">Cordialement,</p><footer> <img src="red"/></footer>';
        if (req.body.mailcustom)
            htmlmail = req.body.mailcustom.replace('<lien>', url) + "<footer> <img src='red'/></footer>"
        htmlmail = htmlmail.replaceAll('\n', '<br>')
        let mailOptions = {
            from: 'ims@intedgroup.com',
            to: mailList,
            subject: 'Emploi du temps',
            html: htmlmail,
            attachments: [{
                filename: 'signature_peda_estya.png',
                path: 'assets/signature_peda_estya.png',
                cid: 'red' //same cid value as in the html img src
            }]
        };
        if (htmlmail.indexOf('<signature espic>') != -1) {
            mailOptions.attachments = [{
                filename: 'siganture_espic.png',
                path: 'assets/signature_espic.png',
                cid: 'red' //same cid value as in the html img src
            }]
            mailOptions.html = htmlmail.replace('<signature espic>', '')
        } else if (htmlmail.indexOf('<signature adg>') != -1) {
            mailOptions.attachments = [{
                filename: 'siganture_adg.png',
                path: 'assets/siganture_adg.png',
                cid: 'red' //same cid value as in the html img src
            }]
            mailOptions.html = htmlmail.replace('<signature adg>', '')
        } else if (htmlmail.indexOf('<signature eduhorizons>') != -1) {
            mailOptions.attachments = [{
                filename: 'siganture_eh.png',
                path: 'assets/siganture_eh.png',
                cid: 'red' //same cid value as in the html img src
            }]
            mailOptions.html = htmlmail.replace('<signature eduhorizons>', '')
        }
        mailOptions.html = htmlmail.replace('<signature estya>', '')
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            }
            console.log("SEND TO", mailList)
        });
        res.status(201).send(mailList)
    })
});

const multer = require('multer');
const { Seance } = require('../models/seance');


app.get("/getFiles/:id", (req, res) => {
    let filesTosend = [];
    fs.readdir('./storage/formateur/' + req.params.id + "/", (err, files) => {

        if (!err) {
            files.forEach(file => {
                filesTosend.push(file)
            });
        }
        res.status(200).send(filesTosend);
    }, (error) => (console.error(error)))
})

app.get("/downloadFile/:id/:filename", (req, res) => {
    let pathFile = "storage/formateur/" + req.params.id + "/" + req.params.filename
    let file = fs.readFileSync(pathFile, { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    res.status(200).send({ file: file, documentType: mime.contentType(path.extname(pathFile)) })

});


app.get("/deleteFile/:id/:filename", (req, res) => {
    let pathFile = "storage/formateur/" + req.params.id + "/" + req.params.filename
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
        if (!fs.existsSync('storage/formateur/' + req.body.id + '/')) {
            fs.mkdirSync('storage/formateur/' + req.body.id + '/', { recursive: true })
        }
        callBack(null, 'storage/formateur/' + req.body.id + '/')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 20000000 } })

app.post('/uploadFile/:id', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        res.status(400).send(error)
    } else {

        res.status(201).json({ dossier: "dossier mise à jour" });
    }

}, (error) => { res.status(500).send(error); })

app.get('/getAllInfos/:month/:year', (req, res, next) => {
    //[{ formateur_id: User, mois: Number, nombre_heure: Number, rapport: [{ seance: Seance, rapport: any }] }]
    let db = new Date(parseInt(req.params.year), parseInt(req.params.month), 1, 0)
    let df = new Date(parseInt(req.params.year), parseInt(req.params.month), 31, 23)
    let dicRemarque = {}
    RemarqueFacture.find({ mois: parseInt(req.params.month), year: parseInt(req.params.year) }).then(remarques => {
        remarques.forEach(r => {
            dicRemarque[r.user_id] = r
        })
        Presence.find({ date_signature: { $gt: db, $lt: df }, signature: true }).populate('user_id').populate('seance_id').then(presences => {
            let rapport = []
            let documents = {} //{formateur_id:[{ seance: Seance }]}
            let formateurIds = []
            let totalHeureFormateur = {}//{formateur_id:Number}
            presences.forEach(p => {
                if (p.seance_id && p.user_id && p.user_id.type == "Formateur") {
                    let date_fin = new Date(p.seance_id.date_fin)
                    let date_debut = new Date(p.seance_id.date_debut)
                    let totalHeure = 0
                    totalHeure += date_fin.getHours() - date_debut.getHours()
                    if ((date_fin.getMinutes() == 30 && date_debut.getMinutes() != 30) || (date_fin.getMinutes() != 30 && date_debut.getMinutes() == 30))
                        totalHeure = totalHeure + 0.5
                    if (!formateurIds.includes(p.user_id)) {
                        formateurIds.push(p.user_id)
                        totalHeureFormateur[p.user_id._id] = totalHeure
                        if (p.seance_id.fileRight && p.seance_id.fileRight.length != 0)
                            documents[p.user_id._id] = [p.seance_id]
                    } else {
                        totalHeureFormateur[p.user_id._id] += totalHeure
                        if (p.seance_id.fileRight && p.seance_id.fileRight.length != 0)
                            if (documents[p.user_id._id])
                                documents[p.user_id._id].push(p.seance_id)
                            else
                                documents[p.user_id._id] = [p.seance_id]
                    }
                }
            })
            formateurIds.forEach(f => {
                let d = []
                let remarque = new RemarqueFacture({ user_id: f._id, remarque: "", mois: parseInt(req.params.month), year: parseInt(req.params.year) })
                if (dicRemarque[f._id])
                    remarque = dicRemarque[f._id]
                if (documents[f._id])
                    d = documents[f._id]
                rapport.push({ formateur_id: f, mois: parseInt(req.params.month), nombre_heure: totalHeureFormateur[f._id], rapport: d, remarque })
            })
            res.send(rapport)
        })
    })
})

//Recupère un formateur via un userId
app.get("/getPopulateByUserId/:id", (req, res, next) => {
    if (req.params.id != "null")
        Formateur.findOne({ user_id: req.params.id }).populate('campus_id').populate('user_id')
            .then((formateurFromDb) => { res.status(200).send(formateurFromDb) })
            .catch((error) => { res.status(400).json({ error: "Impossible de recuperer cet formateur via son userId " + error.message }) });
    else {
        res.status(200).send(null)
    }
})

app.get('/getAllVolume/:user_id', (req, res) => {
    let dic = {} //{ 'id': { matiere_nom: "", v_ini: 0, v_plan: 0, v_cons: 0, matiere_id: "" } }

    Seance.find({ formateur_id: req.params.user_id, isPlanified: false }).populate('matiere_id').populate({ path: 'classe_id', populate: { path: 'diplome_id' } }).then(seances => {
        seances.forEach(seance => {

            if (seance && seance.matiere_id) {
                let m = seance?.matiere_id
                let filiere = null
                let nb = ""

                if (Array.isArray(seance.classe_id)) {
                    if (seance.classe_id[0] != undefined) {
                        if (seance.classe_id[0].abbrv.indexOf('1') != -1)
                            nb = "1"
                        if (seance.classe_id[0].abbrv.indexOf('2') != -1)
                            nb = "2"
                        filiere = seance.classe_id[0].diplome_id;
                    }
                    else {
                        filiere = { titre: seance.classe_id.abbrv }
                    }

                }
                else {
                    if (seance.classe_id.abbrv.indexOf('1') != -1)
                        nb = "1"
                    if (seance.classe_id.abbrv.indexOf('2') != -1)
                        nb = "2"
                    filiere = seance.classe_id.diplome_id
                }

                let v = new Date(seance.date_fin).getHours() - new Date(seance.date_debut).getHours()
                let isPlanified = new Date() < new Date(seance.date_debut)

                if (dic[m._id]) {
                    if (isPlanified)
                        dic['v_plan'] = dic['v_plan'] + v
                    else
                        dic.v_cons = dic.v_cons + v
                } else {
                    if (isPlanified)
                        dic[m._id] = { matiere_nom: `${m.nom} - ${filiere?.titre} ${nb}`, v_ini: m.volume_init, v_plan: v, v_cons: 0, matiere_id: m._id }
                    else
                        dic[m._id] = { matiere_nom: `${m.nom} - ${filiere?.titre} ${nb}`, v_ini: m.volume_init, v_plan: 0, v_cons: v, matiere_id: m._id }
                }
            }
        })
        let r = Object.keys(dic).map(function (key) {
            return dic[key];
        });
        res.send(r)
    })
})

//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;
