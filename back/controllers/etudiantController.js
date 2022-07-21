const express = require("express");
const app = express();
const nodemailer = require('nodemailer');
const { Etudiant } = require("./../models/etudiant");
const { Classe } = require("./../models/classe");
const { Examen } = require("./../models/examen");
const { Note } = require("./../models/note");
const { User } = require('./../models/user');
app.disable("x-powered-by");
const path = require('path');
var mime = require('mime-types')
const fs = require("fs")

let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'ims@estya.com',
        pass: 'ESTYA@@2021',
    },
});



//création d'un nouvel étudiant
app.post("/create", (req, res, next) => {
    //creation du nouvel étudiant
    let etudiantData = req.body.newEtudiant;
    delete etudiantData._id
    let etudiant = new Etudiant(
        {
            ...etudiantData
        });  //Creation du nouveau user
    let userData = req.body.newUser;
    let user = new User(
        {
            civilite: userData.civilite,
            firstname: userData.firstname,
            lastname: userData.lastname,
            indicatif: userData.indicatif,
            phone: userData.phone,
            email: userData.email,
            //password: bcrypt.hashSync(userData.password, 8),
            role: userData.role,
            service_id: userData.service_id,
            type: "Etudiant",

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
                Etudiant.findOne({ user_id: userFromDb._id })
                    .then((etudiantFromDb) => {
                        if (etudiantFromDb) {
                            res.status(400).json({ error: 'Cet étudiant existe déja' });
                        } else {
                            etudiant.user_id = userFromDb._id;
                            etudiant.save()

                                .then((etudiantSaved) => { res.status(201).json({ success: "Etudiant ajouté dans la BD!", data: etudiantSaved }) })
                                .catch((error) => { res.status(400).json({ error: "Impossible d'ajouter cet étudiant " + error.message }) });

                        }
                    })
                    .catch((error) => { res.status(400).json({ error: "Impossible de verifier l'existence de l'étudiant" }) });
            }
            else {
                user.save()
                    .then((userCreated) => {
                        etudiant.user_id = userCreated._id;
                        etudiant.save()
                            .then((etudiantCreated) => { res.status(201).json({ success: 'Etudiant crée' }) })
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




app.post("/createfromPreinscrit", (req, res, next) => {
    //creation du nouvel étudiant
    let etudiantData = req.body;
    let etudiant = new Etudiant(
        {
            ...etudiantData
        });
    etudiant.save()
        .then((etudiantFromDb) => {
            Prospect.findByIdAndUpdate(req.body._id, { archived: true }).then()
            res.status(201).json({
                success: "Etudiant ajouté dans la BD!", data: etudiantFromDb
            })
        })
        .catch((error) => { res.status(400).json({ error: "Impossible d'ajouter cet étudiant " + error.message }) });
});


//Récupérer la liste de tous les étudiants
app.get("/getAll", (req, res, next) => {
    Etudiant.find({ classe_id: { $ne: null } })
        .then((etudiantsFromDb) => {
            res.status(200).send(etudiantsFromDb);
        })
        .catch((error) => { res.status(500).send('Impossible de recuperer la liste des étudiant'); })
});


//Récupérer la liste de tous les étudiants via un Id de classe
app.get("/getAllByClasseId/:id", (req, res, next) => {
    Etudiant.find({ classe_id: req.params.id })
        .then((etudiantsFromDb) => { res.status(200).send(etudiantsFromDb); })
        .catch((error) => { res.status(500).send('Impossible de recuperer la liste des étudiant'); })
});

//Récupérer la liste de tous les étudiants en attente d'assignation
app.get("/getAllWait", (req, res, next) => {
    Etudiant.find({ classe_id: null })
        .then((etudiantsFromDb) => { res.status(200).send(etudiantsFromDb); })
        .catch((error) => { res.status(500).send('Impossible de recuperer la liste des étudiant'); })
});


//Recupere un étudiant via son identifiant
app.get("/getById/:id", (req, res, next) => {
    Etudiant.findOne({ _id: req.params.id })
        .then((etudiantFromDb) => { res.status(200).send(etudiantFromDb); })
        .catch((error) => { res.status(500).send('Impossible de recuperer cet étudiant ' + error.message); })
});

//Recupere un étudiant via son user_id
app.get("/getByUserid/:user_id", (req, res, next) => {
    Etudiant.findOne({ user_id: req.params.user_id })
        .then((etudiantFromDb) => { res.status(200).send(etudiantFromDb); })
        .catch((error) => { res.status(500).send('Impossible de recuperer cet étudiant ' + error.message); })
});


//Mettre à jour un étudiant via son identifiant
app.post("/update", (req, res, next) => {
    Etudiant.findOneAndUpdate({ _id: req.body._id },
        {
            ...req.body
        }, { new: true }, (err, user) => {
            if (err) {
                console.error(err);
                res.send(err)
            } else {
                res.send(user)
            }
        })
});

// ajouter le droit d'acces au document ajouter 
app.post("/setFileRight/:idetudiant", (req, res, next) => {

    let filename = req.body[1]

    Etudiant.findOne({ _id: req.params.idetudiant })
        .then((etudiantFromDb) => {
            let filearrayT;
            filearrayT = (etudiantFromDb.fileRight) ? etudiantFromDb.fileRight : { 'filename': true };
            filearrayT[filename] = req.body[2]

            Etudiant.findOneAndUpdate({ _id: req.params.idetudiant },
                {
                    fileRight: filearrayT,
                }, { new: true }, (err, etudiant) => {
                    if (err) {
                        console.log(err);
                        res.send(err)
                    } else {

                        res.send(etudiant)
                    }
                })
        })

});

app.get('/sendEDT/:id/:update', (req, res, next) => {
    let msg = "Votre emploi du temps est disponible"
    if (req.params.update == "YES") {
        msg = "Votre emploi du temps a été modifier\nVeuillez verifier les changements\nDésolé de la gêne occasionnée"
    }
    let mailList = []
    Etudiant.find({ classe_id: req.params.id }).then(etudiantList => {
        etudiantList.forEach(etudiant => {
            User.findById(etudiant.user_id).then(user => {
                //Envoie de mail à user.email
                mailList.push(user.email)
            })
        })
        let htmlmail = '<p style="color:black">Bonjour,\n' + msg + "</p>"
            + '<a href="t.dev.estya.com/calendrier/classe/ + ' + req.params.id + '">Voir mon emploi du temps</a></p><p style="color:black">Cordialement.</p><footer> <img  src="red"/></footer>';
        let mailOptions = {
            from: 'ims@estya.com',
            to: mailList,
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
            console.log("SEND TO", mailList)
        });
        res.status(201).send(mailList)

    })
});
/*
1- Récupérer toutes les notes de la classe du semestre
2- Récupérer toutes les examens de chaque matière 
3- Faire la moyenne de chaque étudiant pour chaque matière
4- Récupérer la moyenne basse et haute (min() et max()) de chaque matière
5- Récupérer la moyenne de l'étudiant de chaque matière
*/
app.get("/getBulletin/:etudiant_id/:semestre", (req, res, next) => {
    Etudiant.findById(req.params.etudiant_id).then(etudiant => {
        Classe.findById(etudiant.classe_id).then(classe => {
            Etudiant.find({ classe_id: etudiant.classe_id }).then(listEtudiant => {
                var listNotes = []
                var dicMatiere = {}
                var listMatiere = []
                var dicExamen = {}
                var listeNotesEleves = {}//id_eleve:[id_matiere:[note]]
                var dicMoy = {}
                var dicMoyMatiere = {}
                var MoyenneEtudiant = {} //[id_matiere:moyenne]
                let my = 0
                Examen.find({ classe_id: etudiant.classe_id }).then(listExamen => {
                    let dicNotes = {}
                    Note.find({ semestre: req.params.semestre }).then(n => {
                        n.forEach(note => {
                            if (dicNotes[note.examen_id] && dicNotes[note.examen_id].length != 0) {
                                dicNotes[note.examen_id].push(note)
                            } else {
                                dicNotes[note.examen_id] = [note]
                            }
                        })
                        listExamen.forEach(examen => {
                            dicExamen[examen._id] = examen
                            //1- Récupérer toutes les notes de la classe du semestre
                            listNotes = listNotes.concat(dicNotes[examen._id])
                            if (!listMatiere.includes(examen.matiere)) {
                                listMatiere.push(examen.matiere)
                            }
                            //2- Récupérer toutes les examens de chaque matière 
                            if (dicMatiere[examen.matiere] && dicMatiere[examen.matiere].length != 0) {
                                dicMatiere[examen.matiere].push(examen._id)
                            } else {
                                dicMatiere[examen.matiere] = [examen._id]
                            }
                        })
                        //3- Faire la moyenne de chaque étudiant pour chaque matière
                        let listEtuEx = []
                        let listMatierev2 = []
                        listNotes.forEach(note => {
                            if (listeNotesEleves[note.etudiant_id]) {
                                if (listeNotesEleves[note.etudiant_id][dicExamen[note.examen_id].matiere_id] && listeNotesEleves[note.etudiant_id][dicExamen[note.examen_id].matiere_id].length != 0) {
                                    listeNotesEleves[note.etudiant_id][dicExamen[note.examen_id].matiere_id].push(parseInt(note.note_val) / parseInt(dicExamen[note.examen_id].note_max))
                                } else {
                                    listeNotesEleves[note.etudiant_id][dicExamen[note.examen_id].matiere_id] = [parseInt(note.note_val) / parseInt(dicExamen[note.examen_id].note_max)]
                                }
                            } else {
                                listeNotesEleves[note.etudiant_id] = {}
                                listeNotesEleves[note.etudiant_id][dicExamen[note.examen_id].matiere_id] = [parseInt(note.note_val) / parseInt(dicExamen[note.examen_id].note_max)]
                            }
                            if (!listEtuEx.includes({ "etudiant": note.etudiant_id, "matiere": dicExamen[note.examen_id].matiere_id })) {
                                listEtuEx.push({ "etudiant": note.etudiant_id, "matiere": dicExamen[note.examen_id].matiere_id })
                            }
                        })
                        //4- Récupérer la moyenne basse et haute (min() et max()) de chaque matière
                        listEtuEx.forEach(etuEx => {
                            if (!dicMoy[etuEx.etudiant] || dicMoy[etuEx.etudiant].length != 0) {
                                dicMoy[etuEx.etudiant] = {}
                                dicMoy[etuEx.etudiant][etuEx.matiere] = avg(listeNotesEleves[etuEx.etudiant][etuEx.matiere])
                            } else {
                                dicMoy[etuEx.etudiant][etuEx.matiere] = avg(listeNotesEleves[etuEx.etudiant][etuEx.matiere])
                            }
                            if (etuEx.etudiant == req.params.etudiant_id) {
                                //5- Récupérer la moyenne de l'étudiant de chaque matière
                                MoyenneEtudiant[etuEx.matiere] = avg(listeNotesEleves[etuEx.etudiant][etuEx.matiere])
                                my += MoyenneEtudiant[etuEx.matiere]
                                if (!listMatierev2.includes(etuEx.matiere)) {
                                    listMatierev2.push(etuEx.matiere)
                                }
                            }
                            if (!dicMoyMatiere[etuEx.matiere] || dicMoyMatiere[etuEx.matiere].length != 0) {
                                dicMoyMatiere[etuEx.matiere] = [avg(listeNotesEleves[etuEx.etudiant][etuEx.matiere])]
                            } else {
                                dicMoyMatiere[etuEx.matiere].push(avg(listeNotesEleves[etuEx.etudiant][etuEx.matiere]))
                            }

                        })
                        console.log(MoyenneEtudiant, MoyenneEtudiant.length)
                        my = my / MoyenneEtudiant.length
                        //                      Moyenne Classe, Moyenne Etudiant, 
                        res.status(200).send({ dicMoyMatiere, MoyenneEtudiant, listeNotesEleves, listMatiere: listMatierev2, moyenneGeneral: my })
                    })
                })
            })
        })
    })
})

app.get("/getBulletinV3/:etudiant_id/:semestre", (req, res, next) => {
    // MATIERE, COEF, MOY ETU, MOY CLASSE, MIN CLASSE, Max Classe, Appreciation
    // MOY TT ETU
    // { matiere_name: "Template", coef: 2, moy_etu: 10.00, moy_classe: 10.00, min_classe: 0.00, max_classe: 20.00, appreciation: "J'adore ce test",matiere_id: matiere_id._id }
    let r = []
    let moy_tt = 0
    Etudiant.findById(req.params.etudiant_id).then(chosenOne => {
        Etudiant.find({ classe_id: chosenOne.classe_id }).then(etudiants => {
            let listEtudiantID = []
            etudiants.forEach(etu => {
                listEtudiantID.push(etu._id)
            })
            Note.find({ etudiant_id: { $in: listEtudiantID }, semestre: req.params.semestre }).populate({ path: "examen_id", populate: { path: "matiere_id" } }).then(notes => {
                let listExamenID = []
                let listMatiereNOM = []
                let listNotesEtudiants = {} // {etudiant_id:{matiere_id:[number]}}
                let listMoyenneEtudiants = {} // {etudiant_id:{matiere_id:number}}
                let listMoyenne = {} // {matiere_nom:[number]}
                let dicMatiere = {}
                notes.forEach(n => {
                    if (n.examen_id != null && !listExamenID.includes(n.examen_id._id)) {
                        listExamenID.push(n.examen_id._id)
                    }
                    if (n.examen_id != null && n.examen_id.matiere_id != null && !listMatiereNOM.includes(n.examen_id.matiere_id.nom)) {
                        listMatiereNOM.push(n.examen_id.matiere_id.nom)
                        dicMatiere[n.examen_id.matiere_id.nom] = n.examen_id.matiere_id
                    }

                })
                listEtudiantID.forEach(e_id => {
                    listNotesEtudiants[e_id] = {}
                    listMatiereNOM.forEach(m_nom => {
                        listNotesEtudiants[e_id][m_nom] = []
                        notes.forEach(note => {
                            if (note.etudiant_id.toString() == e_id.toString() && note.examen_id.matiere_id.nom == m_nom) {
                                listNotesEtudiants[e_id][m_nom].push(parseFloat(note.note_val))
                            }
                        })
                    })
                })
                listEtudiantID.forEach(e_id => {
                    listMoyenneEtudiants[e_id] = {}
                    listMatiereNOM.forEach(m_nom => {
                        listMoyenneEtudiants[e_id][m_nom] = 0
                        if (listNotesEtudiants[e_id][m_nom] != [] && listNotesEtudiants[e_id][m_nom].length != 0) {
                            listMoyenneEtudiants[e_id][m_nom] = avg(listNotesEtudiants[e_id][m_nom])
                        }
                    })
                })
                listMatiereNOM.forEach(m_nom => {
                    listMoyenne[m_nom] = []
                    listEtudiantID.forEach(e_id => {
                        listMoyenne[m_nom].push(listMoyenneEtudiants[e_id][m_nom])
                    })
                })
                listMatiereNOM.forEach(m_nom => {
                    r.push({ matiere_name: m_nom, coef: dicMatiere[m_nom].coeff, moy_etu: listMoyenneEtudiants[req.params.etudiant_id][m_nom], moy_classe: avg(listMoyenne[m_nom]), min_classe: min(listMoyenne[m_nom]), max_classe: max(listMoyenne[m_nom]), matiere_id: dicMatiere[m_nom]._id })
                    moy_tt += listMoyenneEtudiants[req.params.etudiant_id][m_nom]
                })
                moy_tt = moy_tt / Object.keys(listMoyenneEtudiants[req.params.etudiant_id]).length
                console.log({ data: r, moyenneEtudiant: moy_tt })
                res.status(201).send({ data: r, moyenneEtudiant: moy_tt })
            })
        })
    })
})

app.get("/getAllByCode/:code", (req, res) => {
    Etudiant.find({ classe_id: { $ne: null } }).then(result => {
        let p = []
        result.forEach(d => {
            if (d.code_partenaire == req.params.code) {
                p.push(d)
            }
        })
        res.send(p)
    })
});

function avg(myArray) {
    var i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++];
    }
    return summ / ArrayLen;
}

function min(myArray) {
    var i = 0, min = myArray[0], ArrayLen = myArray.length;
    while (i < ArrayLen) {
        if (myArray[i] < min) {
            min = myArray[i]
        }
        i++
    }
    return min;
}

function max(myArray) {
    var i = 0, min = myArray[0], ArrayLen = myArray.length;
    while (i < ArrayLen) {
        if (myArray[i] > min) {
            min = myArray[i]
        }
        i++
    }
    return min;
}

const multer = require('multer');
const { Prospect } = require("../models/prospect");


app.get("/getFiles/:id", (req, res) => {
    let filesTosend = [];
    fs.readdir('./storage/etudiant/' + req.params.id + "/", (err, files) => {

        if (!err) {
            files.forEach(file => {
                filesTosend.push(file)
            });
        }
        res.status(200).send(filesTosend);
    }, (error) => (console.error(error)))
})

app.get("/downloadFile/:id/:filename", (req, res) => {
    let pathFile = "storage/etudiant/" + req.params.id + "/" + req.params.filename
    let file = fs.readFileSync(pathFile, { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    res.status(200).send({ file: file, documentType: mime.contentType(path.extname(pathFile)) })

});


app.get("/deleteFile/:id/:filename", (req, res) => {
    let pathFile = "storage/etudiant/" + req.params.id + "/" + req.params.filename
    try {
        fs.unlinkSync(pathFile)
    } catch (err) {
        console.error(err)
        res.status(400).send(err)
    }

    Etudiant.findOne({ _id: req.params.id })
        .then((etudiantFromDb) => {
            let filearrayT = etudiantFromDb.fileRight;

            delete filearrayT[req.params.filename]

            Etudiant.findOneAndUpdate({ _id: req.params.id },
                {
                    fileRight: filearrayT,
                }, { new: true }, (err, etudiant) => {
                    if (err) {
                        console.log(err);
                        res.send(err)
                    }
                    else {
                        res.status(200).send()
                    }
                })
        })
        .catch((error) => { res.status(400).json({ error }) });




});

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        if (!fs.existsSync('storage/etudiant/' + req.body.id + '/')) {
            fs.mkdirSync('storage/etudiant/' + req.body.id + '/', { recursive: true })
        }
        callBack(null, 'storage/etudiant/' + req.body.id + '/')
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

app.post('/getAllByMultipleClasseID', (req, res) => {
    Etudiant.find({ classe_id: { $in: req.body.classe_id } }).populate("user_id").populate("classe_id").then(result => {
        res.send(result)
    })
});
module.exports = app;
