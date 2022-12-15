//importation de express
const express = require('express');
const app = express();
const { Seance } = require("./../models/seance");
const { Formateur } = require("./../models/formateur");
const { User } = require("./../models/user");
const { Presence } = require("./../models/presence");
const { Classe } = require("./../models/classe")
app.disable("x-powered-by");
const path = require('path');
var mime = require('mime-types')
const fs = require("fs")

function customIncludes(listSeance, listGiven) {
    let r = false
    listSeance.forEach(s => {
        listGiven.forEach(g => {
            if (s == g)
                r = true
        })
    })
    return r
}

//Creation d'une nouvelle 
app.post('/create', (req, res, next) => {
    //Création d'une nouvelle 
    let seance = new Seance({
        ...req.body
    });

    Seance.find()
        .then(data => {
            let text = null
            let error = false
            if (req.body.formateur_id)
                data.forEach(temp => {
                    if (temp.formateur_id == req.body.formateur_id) {
                        text = "Le formateur est déjà assigné à une séance :\n"
                    } else if (customIncludes(temp.classe_id, req.body.classe_id)) {
                        text = "La classe est déjà assigné à une séance :\n"
                    } else {
                        text = null
                    }
                    if (text && !error) {
                        let s = temp.date_debut.getTime() // debut = temp.date_debut
                        let e = temp.date_fin.getTime() // fin = temp.date_fin
                        let cs = new Date(req.body.date_debut).getTime() //date to check = req.body.date_debut
                        let ce = new Date(req.body.date_fin).getTime() //date to check = req.body.date_fin

                        //Si une séance existante se trouve pendant la séance
                        if (cs == s && e == cs) {
                            error = true
                            res.status(400).send({ text: text + "Cette séance s'interpose avec une autre séance\nVérifier les deux dates", temp })
                            return false
                        } else if (cs >= s && cs < e) {
                            //Si la date de debut de la nouvelle séance est entre une existante
                            error = true
                            res.status(400).send({ text: text + "Cette séance s'interpose avec une autre séance\nVérifier la date de début", temp })
                            return false
                        }
                        //Si la date de fin de la nouvelle séance est entre une existante
                        else if (ce > s && ce <= e) {
                            error = true
                            res.status(400).send({ text: text + "Cette séance s'interpose avec une autre séance\nVérifier la date de fin", temp })
                            return false
                        }
                    }
                })
            if (new Date(req.body.date_debut).getTime() > new Date(req.body.fin).getTime() && !error) {
                res.status(400).send("La date de début est supérieur à la date de fin")
            } else if (!error) {
                //Envoi vers la BD
                seance.save()
                    .then((saveSeance) => res.status(201).send(saveSeance))
                    .catch(error2 => res.status(400).send(error2));
            }
        })
});

app.get('/getAllByMatiere/:module_id', (req, res) => {
    Seance.find({ matiere_id: req.params.module_id }).then(r => {
        //CAN BE POPULATE
        res.send(r)
    })
})


//Modification d'une  via son id
app.post('/edit/:id', (req, res, next) => {
    //Trouve et met à jour une 
    Seance.findOneAndUpdate(
        { _id: req.params.id },
        {
            classe_id: req.body.classe_id,
            matiere_id: req.body.matiere_id,
            libelle: req.body.libelle,
            date_debut: req.body.date_debut,
            date_fin: req.body.date_fin,
            formateur_id: req.body.formateur_id,
            infos: req.body.infos,
            isPresentiel: req.body.isPresentiel,
            salle_name: req.body.salle_name,
            isPlanified: req.body.isPlanified,
            campus_id: req.body.campus_id,
            nbseance: req.body.nbseance
        }, { new: true }
    ).then((Seancefromdb) => res.status(201).send(Seancefromdb))
        .catch(error => res.status(400).send(error));
});


//Recuperation de toutes les s
app.get("/getAll", (req, res, next) => {
    Seance.find().sort({ date_debut: 'asc' })
        .then((SeanceFromdb) => { res.status(200).send(SeanceFromdb); })
        .catch((error) => { req.status(500).send('Impossible de recupérer la liste des séances ' + error.message); });
});

//Recuperation d'une s selon son id
app.get('/getById/:id', (req, res, next) => {
    Seance.findOne({ _id: req.params.id })
        .then((SeanceFromdb) => res.status(200).send(SeanceFromdb))
        .catch(error => res.status(400).send(error));
});


//Recuperation de toute les s selon l'id d'une classe
app.get('/getAllByClasseId/:id', (req, res, next) => {
    Seance.find({ classe_id: { $in: req.params.id } }).sort({ date_debut: 'asc' })
        .then((SeanceFromdb) => res.status(200).send(SeanceFromdb))
        .catch(error => {
            console.error(error)
            res.status(400).send(error)
        });
});

app.post('/getAllFinishedByClasseId/:id', (req, res, next) => {
    let ListSeanceFinished;
    let ListPresences = [];
    Seance.find({ classe_id: { $in: req.params.id }, date_fin: { $lt: Date.now() } }).sort({ date_debut: 'asc' })
        .then((SeanceFromdb) => {
            ListSeanceFinished = SeanceFromdb;
            let dernierS = SeanceFromdb[SeanceFromdb.length - 1]


            ListSeanceFinished.forEach(async SF => {

                Presence.find({
                    user_id: req.body.user_id, seance_id: SF.id
                }).then((data) => {
                    console.log("data")
                    console.log(data)
                    if (data.length > 0) {

                        console.log("Prensence Trouvé")
                        ListPresences.push(data);
                        console.log(ListPresences)
                        if (dernierS._id == SF.id) {
                            console.log("res to send: " + ListPresences.length)
                            res.status(200).send(ListPresences);
                        }
                    }
                    else {

                        let presence = new Presence({
                            seance_id: SF.id,
                            user_id: req.body.user_id,
                            isPresent: false,
                            signature: false,
                            justificatif: false,
                            date_signature: null,
                            allowedByFormateur: false,
                        });
                        presence.save((err, dataCreated) => {
                            //Sauvegarde de la signature si il y en a une
                            if (err) {
                                console.error(err)
                                res.send(err)
                            } else {
                                ListPresences.push(dataCreated)

                                console.log("added pre")
                                console.log(ListPresences)
                            }
                            if (dernierS._id == SF.id) {
                                console.log("res to send: " + ListPresences.length)
                                res.status(200).send(ListPresences);
                            }
                        })

                    }
                }, (err) => { console.log(err) })

            });



        })

});
//Recuperation de toute les s selon l'id d'une classe
app.get('/getAllByDiplomeID/:id', (req, res, next) => {
    let cids = []
    Classe.find({ diplome_id: req.params.id }).sort({ date_debut: 'asc' }).then(classe => {
        classe.forEach(c => {
            cids.push(c._id)
        })
        Seance.find({ classe_id: { $in: cids } })
            .then((SeanceFromdb) => res.status(200).send(SeanceFromdb))
            .catch(error => {
                console.error(error)
                res.status(400).send(error)
            });
    })
});


//Recuperation de toute les s selon l'identifiant du formateur
app.get('/getAllbyFormateur/:id', (req, res, next) => {
    Seance.find({ formateur_id: req.params.id }).sort({ date_debut: 'asc' })
        .then((SeanceFromdb) => res.status(200).send(SeanceFromdb))
        .catch(error => res.status(400).send(error));
});
app.get('/getAllbyFormateurToday/:id', (req, res, next) => {
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999)
    Seance.find({ formateur_id: req.params.id, date_debut: { $gte: start, $lt: end } })
        .then((SeanceFromdb) => {
            console.log(SeanceFromdb)
            res.status(200).send(SeanceFromdb)
        })
        .catch(error => {
            res.status(400).send(error);
        });
});
app.get('/getAllByRange/:date_debut/:date_fin', (req, res, next) => {
    let dd = new Date(req.params.date_debut)
    let df = new Date(req.params.date_fin)
    Seance.find({ date_debut: { $gte: dd, $lt: df } }).sort({ date_debut: 'asc' })
        .then((SeanceFromdb) => res.status(200).send(SeanceFromdb))
        .catch(error => res.status(400).send(error));
});

app.get("/convertAllPlanified", (req, res) => {
    Seance.updateMany({ isPlanified: true }, { isPlanified: false })
        .then(
            (SeanceFromdb) => {
                res.status(200).send(SeanceFromdb)
            }
        )
        .catch(error => res.status(400).send(error));
})

//Recuperation de toutes les s
app.get('/getPlanified', (req, res, next) => {
    Seance.find({ isPlanified: true })
        .then((SeanceFromdb) => res.status(200).send(SeanceFromdb))
        .catch(error => res.status(400).send(error));
});

app.get('/getNb/:c_id/:f_id', (req, res) => {
    Seance.find({ classe_id: req.params.c_id, formateur_id: req.params }).then(
        data => res.status(200).send(data.length)
    ).catch(
        error => res.status(400).send(error)
    )
})

const multer = require('multer');
const { Etudiant } = require('../models/etudiant');


app.get("/getFiles/:id", (req, res) => {
    let filesTosend = [];
    fs.readdir('./storage/seance/' + req.params.id + "/", (err, files) => {

        if (!err) {
            files.forEach(file => {
                filesTosend.push(file)
            });
        }
        res.status(200).send(filesTosend);
    }, (error) => (console.error(error)))
})

app.get("/downloadFile/:id/:filename", (req, res) => {
    let pathFile = "storage/seance/" + req.params.id + "/" + req.params.filename
    console.log(pathFile)
    let file = fs.readFileSync(pathFile, { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    res.status(200).send({ file: file, documentType: mime.contentType(path.extname(pathFile)) })

});


app.get("/deleteFile/:id/:filename", (req, res) => {
    let pathFile = "storage/seance/" + req.params.id + "/" + req.params.filename
    let errG = null
    try {
        fs.unlinkSync(pathFile)
    } catch (err) {
        console.error(err)
        errG = err
        res.status(400).send(err)
    }
    if (errG == null) {
        Seance.findById(req.params.id).then(data => {
            let arr = []
            data.fileRight.forEach(file => {
                if (file.name != req.params.filename) {
                    arr.push(file)
                }
            })
            Seance.findByIdAndUpdate(req.params.id, { fileRight: arr }, { new: true }).exec(function (err, data) {
                if (err) {
                    console.error(err)
                    res.status(500).send(err)
                } else {
                    res.status(201).json({ dossier: "Fichier Supprimé", data });
                }

            })
        })
    }
});

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        if (!fs.existsSync('storage/seance/' + req.body.id + '/')) {
            fs.mkdirSync('storage/seance/' + req.body.id + '/', { recursive: true })
        }
        callBack(null, 'storage/seance/' + req.body.id + '/')
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
        Seance.findById(req.params.id).then(data => {
            let arr = data.fileRight
            if (!arr)
                arr = []
            arr.push({ name: file.filename, right: req.body.etat, upload_by: req.body.user })
            Seance.findByIdAndUpdate(req.params.id, { fileRight: arr }, { new: true }).exec(function (err, data) {
                if (err) {
                    console.error(err)
                    res.status(500).send(err)
                } else {
                    res.status(201).json({ dossier: "Fichier Upload", data });
                }

            })
        })
    }

}, (error) => { res.status(500).send(error); })

app.get('/getFormateurFromClasseID/:classe_id/:semestre', (req, res, next) => {
    console.log()
    Seance.find({ classe_id: req.params.classe_id }).then(seanceList => {
        //TODO Enlever les seances en dehors du semestre
        let dicMatiere = {}//matiere_id:{formateur_id:nb,formateur_id:nb}
        let r = {}//matiere_id:formateur_id
        seanceList.forEach(seance => {
            if (dicMatiere[seance.matiere_id]) {
                if (dicMatiere[seance.matiere_id][seance.formateur_id]) {
                    dicMatiere[seance.matiere_id][seance.formateur_id] += 1
                } else {
                    dicMatiere[seance.matiere_id][seance.formateur_id] = 1
                }
            } else {
                dicMatiere[seance.matiere_id] = {}
                dicMatiere[seance.matiere_id][seance.formateur_id] = 1
            }
        })
        Object.keys(dicMatiere).forEach(matiere => {
            let fList = dicMatiere[matiere]
            let chosenOne = Object.keys(fList)[0]
            let highest = fList[chosenOne]
            Object.keys(fList).forEach(f_id => {
                let nb = fList[f_id]
                if (nb > highest) {
                    highest = nb
                    chosenOne = f_id
                }
            })
            r[matiere] = chosenOne
        })
        res.status(201).send(r)
    })
}, (error) => { res.status(500).send(error); })

app.delete("/delete/:id", (req, res) => {
    Seance.deleteOne({ _id: req.params.id }).then(s => {
        res.status(200).send(s)
    }, error => {
        console.error(error)
        res.status(500).send(error)
    })
})

app.post('/getFormateursFromClasseIDs', (req, res, next) => {
    Seance.find({ matiere_id: { $in: req.body.matieres_ids } }).then(seanceList => {
        let f_ids = []
        seanceList.forEach(s => {
            f_ids.push(s.formateur_id)
        })
        console.log(f_ids)
        Formateur.find({ user_id: { $in: f_ids } }).populate('user_id').then(r => {
            res.status(201).send(r)
        })
    })
}, (error) => { res.status(500).send(error); })
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

app.post('/sendMailModify', (req, res) => {
    let dataPast = req.body.pastSeance
    let dataNew = req.body.newSeance
    let mailUpdateOptions = {
        from: 'ims@intedgroup.com',
        to: 'm.hue@intedgroup.com',
        subject: 'IMS - Modification d\'une séance',
        html: `<p>Bonjour,<br>
        La séance du ${dataPast.date_debut} a été modifié au ${dataNew.date_debut}<br>
        Merci de vérifier votre emploi du temps,
        Cordialement,
        </p>
        `
    };
    res.send(mailUpdateOptions)
    let mailAddOptions = {
        from: 'ims@intedgroup.com',
        to: 'm.hue@intedgroup.com',
        subject: 'IMS - Ajout d\'une séance',
        html: `<p>Bonjour,<br>
        Une nouvelle séance a été crée pour le ${dataPast.date_debut}<br>
        Merci de vérifier votre emploi du temps,
        Cordialement,
        </p>
        `
    };
    let mailDeleteOptions = {
        from: 'ims@intedgroup.com',
        to: 'm.hue@intedgroup.com',//pastFormateur.user_id.email
        subject: 'IMS - Suppression d\'une séance',
        html: `<p>Bonjour,<br>
        La séance prévue pour le ${dataPast.date_debut} a été supprimé<br>
        Merci de votre compréhension
        </p>
        `
    };
    if (dataNew.formateur_id != dataPast.formateur_id) {
        //Notifier l'ancien et le nouveau formateur
        Formateur.findById(dataPast.formateur_id).populate('user_id').then(pastFormateur => {
            //mailDeleteOptions.to = pastFormateur.user_id.email
            transporter.sendMail(mailDeleteOptions, function (error, info) {
                if (error) {
                    console.error(error);
                }
            });
        })
        Formateur.findById(dataNew.formateur_id).populate('user_id').then(newFormateur => {
            //mailAddOptions.to = newFormateur.user_id.email
            transporter.sendMail(mailAddOptions, function (error, info) {
                if (error) {
                    console.error(error);
                }
            });
        })
    } else {
        Formateur.findById(dataNew.formateur_id).populate('user_id').then(newFormateur => {
            //mailUpdateOptions.to = newFormateur.user_id.email
            transporter.sendMail(mailUpdateOptions, function (error, info) {
                if (error) {
                    console.error(error);
                }
            });
        })
    }
    if (dataNew.classe_id != dataPast.classe_id) {
        dataPast.classe_id.forEach(cid => {
            let mailsModifier = []
            let mailsDelete = []
            if (dataNew.classe_id.includes(cid)) {
                //Alors ce groupe est doit être informer d'une modification
                Etudiant.find({ classe_id: cid }).populate('user_id').then(etudiants => {
                    etudiants.forEach(etu => {
                        mailsModifier.push(etu.user_id.email)
                    })
                    //mailUpdateOptions.to = mailsModifier
                    transporter.sendMail(mailUpdateOptions, function (error, info) {
                        if (error) {
                            console.error(error);
                        }
                    });
                })
            } else {
                //Alors ce groupe est doit être informer d'une suppression
                Etudiant.find({ classe_id: cid }).populate('user_id').then(etudiants => {
                    etudiants.forEach(etu => {
                        mailsDelete.push(etu.user_id.email)
                    })
                    //mailDeleteOptions.to = mailsDelete
                    transporter.sendMail(mailDeleteOptions, function (error, info) {
                        if (error) {
                            console.error(error);
                        }
                    });
                })

            }
        })
        dataNew.classe_id.forEach(cid => {
            let mailsAdd = []
            if (!dataPast.classe_id.includes(cid)) {
                //Alors ce groupe est doit être informer d'un ajout
                Etudiant.find({ classe_id: cid }).populate('user_id').then(etudiants => {
                    etudiants.forEach(etu => {
                        mailsAdd.push(etu.user_id.email)
                    })
                    //mailAddOptions.to = mailsAdd
                    transporter.sendMail(mailAddOptions, function (error, info) {
                        if (error) {
                            console.error(error);
                        }
                    });
                })
            }
        })
    }
})

app.post('/sendMailDelete', (req, res) => {
    let seance = req.body
    Formateur.findById(seance.formateur_id).populate('user_id').then(pastFormateur => {
        let mails = [pastFormateur.user_id.email]
        let mailOptions = {
            from: 'ims@intedgroup.com',
            to: 'm.hue@intedgroup.com',//pastFormateur.user_id.email
            subject: 'IMS - Suppression d\'une séance',
            html: `<p>Bonjour,<br>
                La séance prévue pour le ${seance.date_debut} a été supprimé<br>
                Merci de votre compréhension
                </p>
                `
        };
        Etudiant.find({ classe_id: { $in: seance.classe_id } }).populate('user_id').then(etudiants => {
            etudiants.forEach(etu => {
                mails.push(etu.user_id.email)
            })
            //mailOptions.to = mails
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);
                }
            });
        })

    })
})
module.exports = app;