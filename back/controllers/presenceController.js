const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Presence } = require("./../models/presence");
var fs = require('fs')
var Canvas = require('canvas');
const { User } = require("../models/user");
const { Seance } = require("../models/seance");
const { Formateur } = require("../models/formateur");
const { Etudiant } = require("../models/etudiant");
const { send } = require("process");

//Récuperer une présence
app.post("/getById/:id", (req, res) => {
    Presence.findOne({ _id: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send(error);
    })
});

//Récuperer tous les présences
app.get("/getAll", (req, res) => {
    Presence.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })
});

//Récupérer tous les presence d'un user
app.get("/getAllByUser/:id/:type", (req, res) => {
    if (req.params.type != "Agent")
        Presence.find({ user_id: req.params.id, $or: [{ approved_by_pedagogie: true }, { isPresent: true }] }).populate("seance_id").then((data) => {
            let date = new Date("2023-01-01")
            let r = []
            data.forEach(presence => {
                if (presence.seance_id && presence.seance_id.date_debut > date)
                    r.push(presence)
            })
            res.status(200).send(r);
        }).catch((error) => {
            console.error(error)
            res.status(404).send(error);
        })
    else
        Presence.find({ user_id: req.params.id }).populate("seance_id").then((data) => {
            let date = new Date("2023-01-01")
            let r = []
            data.forEach(presence => {
                if (presence.seance_id && presence.seance_id.date_debut > date)
                    r.push(presence)
            })
            res.status(200).send(r);
        }).catch((error) => {
            console.error(error)
            res.status(404).send(error);
        })
});
//Récupérer tous les presence d'une séance
app.get("/getAllBySeance/:id", (req, res) => {
    Presence.find({ seance_id: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send(error);
    })
});

app.get("/getAllPopulateBySeance/:id", (req, res) => {
    Presence.find({ seance_id: req.params.id })
        .populate('seance_id').populate('user_id')
        .then((data) => {
            res.status(200).send(data);
        }).catch((error) => {
            res.status(404).send(error);
        })
});

//Mets un étudiant en présent
app.post("/isPresent/:id", (req, res) => {
    Presence.findByIdAndUpdate(req.params.id,
        {
            isPresent: req.body.isPresent,
            allowedByFormateur: req.body.isPresent,
            PresentielOrDistanciel: req.body.PresentielOrDistanciel
        }, { new: true }, (err, campus) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(campus)
            }

        });
});

//Création d'un nouveau message 
app.post("/create", (req, res) => {

    //Sauvegarde du message
    const presence = new Presence({
        seance_id: req.body.seance_id,
        user_id: req.body.user_id,
        isPresent: req.body.isPresent,
        signature: (req.body.signature) ? true : false,
        justificatif: false,
        date_signature: (req.body.signature) ? Date.now() : null,
        allowedByFormateur: req.body.allowedByFormateur
    });
    Presence.findOne({ seance_id: req.body.seance_id, user_id: req.body.user_id }).then(p => {
        if (!p)
            presence.save((err, data) => {
                //Sauvegarde de la signature si il y en a une
                if (err) {
                    console.error(err)
                    res.send(err)
                } else {
                    res.send(data);
                }
                if (req.body.signature && req.body.signature != null && req.body.signature != '') {
                    fs.mkdir("./storage/signature/",
                        { recursive: true }, (err3) => {
                            if (err3) {
                                console.error(err3);
                            }
                        });
                    fs.writeFile("storage/signature/" + data._id + ".png", req.body.signature, 'base64', function (err2) {
                        if (err2) {
                            console.error(err2);
                        }
                    });
                }
            })
        else
            Presence.findByIdAndUpdate(p._id, { ...presence }).exec().then(() => {
                if (req.body.signature && req.body.signature != null && req.body.signature != '') {
                    fs.mkdir("./storage/signature/",
                        { recursive: true }, (err3) => {
                            if (err3) {
                                console.error(err3);
                            }
                        });
                    fs.writeFile("storage/signature/" + p._id + ".png", req.body.signature, 'base64', function (err2) {
                        if (err2) {
                            console.error(err2);
                        }
                    });
                }
            })
    })

});

//Mets un étudiant en présent
app.post("/addSignature/:id", (req, res) => {
    Presence.findByIdAndUpdate(req.params.id,
        {
            signature: true,
            isPresent: true,
            date_signature: Date.now()
        }, { new: true }, (err, data) => {
            if (err) {
                console.error(err)
                res.send(err)
            }
            else {
                res.send(data)
                if (req.body.signature && req.body.signature != null && req.body.signature != '') {
                    fs.mkdir("./storage/signature/",
                        { recursive: true }, (err3) => {
                            if (err3) {
                                console.error(err3);
                            }
                        });
                    var files = fs.readdirSync("storage/signature/");
                    files.forEach(file => {
                        if (file.includes(data._id)) {
                            try {
                                fs.unlinkSync('storage/signature/' + file)
                                //file removed
                            } catch (errFile) {
                                console.error(errFile)
                            }
                        }
                    });
                    fs.writeFile("storage/signature/" + data._id + ".png", req.body.signature, 'base64', function (err2) {
                        if (err2) {
                            console.error(err2);
                        }
                    });
                }
            }

        });
});

//Mets un étudiant en présent
app.post("/addJustificatif/:user_id/:seance_id", (req, res) => {

    Presence.findOneAndUpdate({ user_id: req.params.user_id, seance_id: req.params.seance_id },
        {
            justificatif: true
        }, { new: true }, (err, data) => {
            if (err) {
                res.send(err)
            }
            else {
                if (data != null) {
                    res.send(data)
                    if (req.body.justificatif && req.body.justificatif != null && req.body.justificatif != '') {
                        fs.mkdir("./storage/justificatif/",
                            { recursive: true }, (err3) => {
                                if (err3) {
                                    console.error(err3);
                                }
                            });
                        var files = fs.readdirSync("storage/justificatif/");
                        files.forEach(file => {
                            if (file.includes(data._id)) {
                                try {
                                    fs.unlinkSync('storage/justificatif/' + file)
                                    //file removed
                                } catch (errFile) {
                                    console.error(errFile)
                                }
                            }
                        });
                        fs.writeFile("storage/justificatif/" + data._id + "." + req.body.name.split('.').pop(), req.body.justificatif, 'base64', function (err2) {
                            if (err2) {
                                console.error(err2);
                            }
                        });
                    }
                } else {
                    let p = new Presence({
                        user_id: req.params.user_id,
                        seance_id: req.params.seance_id,
                        isPresent: false,
                        signature: false,
                        justificatif: true
                    })
                    p.save((err2, data) => {
                        if (err2) {
                            res.status(500).send(err2)
                        } else {
                            res.status(200).send(data)
                        }
                        if (req.body.justificatif && req.body.justificatif != null && req.body.justificatif != '') {
                            fs.mkdir("./storage/justificatif/",
                                { recursive: true }, (err3) => {
                                    if (err3) {
                                        console.error(err3);
                                    }
                                });
                            var files = fs.readdirSync("storage/justificatif/");
                            files.forEach(file => {
                                if (file.includes(data._id)) {
                                    try {
                                        fs.unlinkSync('storage/justificatif/' + file)
                                        //file removed
                                    } catch (errFile) {
                                        console.error(errFile)
                                    }
                                }
                            });
                            fs.writeFile("storage/justificatif/" + data._id + "." + req.body.name.split('.').pop(), req.body.justificatif, 'base64', function (err2) {
                                if (err2) {
                                    console.error(err2);
                                }
                            });
                        }
                    })
                }
            }
        });
});

app.get("/getSignature/:id", (req, res) => {
    Presence.findOne({ _id: req.params.id }).then((data) => {
        let file = fs.readFileSync("storage/signature/" + data._id + ".png", { encoding: 'base64' }, (err) => {
            if (err) {
                return console.error(err);
            }
        });
        res.status(200).send({ file, date_signature: data.date_signature })
    }).catch((error) => {
        res.status(404).send(error);
    })
});

app.get("/getPDF/:id/:groupe_id", (req, res) => {
    Presence.find({ seance_id: req.params.id }).then((data) => {
        const pdfName = req.params.id + ".pdf"
        Seance.findOne({ _id: req.params.id }).then(seance => {
            User.findOne({ _id: seance.formateur_id }).then(formateur => {
                function pad(s) { return (s < 10) ? '0' + s : s; }
                function dateFormat(inputFormat) {
                    var d = new Date(inputFormat)
                    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
                }
                function heureFormat(input) {
                    var d = new Date(input)
                    return [pad(d.getHours()), pad(d.getMinutes())].join(':')
                }
                Etudiant.find().populate("user_id").then(userList => {
                    let UserDic = [];
                    userList.forEach(user => {
                        if (user.user_id != null && user.classe_id == req.params.groupe_id) {
                            UserDic[user.user_id._id] = user
                        }
                    })
                    const canvas = Canvas.createCanvas(827, 1170, 'pdf')
                    const ctx = canvas.getContext('2d')
                    const bg = new Canvas.Image()
                    bg.src = "assets/827X1170.png"
                    ctx.drawImage(bg, 0, 0)
                    ctx.font = '20px Arial'
                    ctx.fillText(formateur.lastname + " " + formateur.firstname, 131, 88, (414 - 131))
                    //Date 85 130 412-85 
                    ctx.fillText(dateFormat(seance.date_debut), 85, 130, (412 - 85))
                    //Heure 488 130
                    ctx.fillText(heureFormat(seance.date_debut) + " - " + heureFormat(seance.date_fin), 488, 130, (412 - 85))
                    let x = 253
                    data.forEach(file => {
                        //PREMIER Eleve 30 253 350
                        if (UserDic[file.user_id]) {
                            if (formateur._id == file.user_id) {
                                if (fs.existsSync("storage/signature/" + file._id + ".png")) {
                                    //Taille signature  532 88 799-532
                                    let img = new Canvas.Image()
                                    img.src = "storage/signature/" + file._id + ".png"
                                    ctx.drawImage(img, 532, 88, (799 - 532), 50)
                                }
                            } else {
                                ctx.font = '20px Arial'

                                ctx.fillText(UserDic[file.user_id].user_id.lastname + " " + UserDic[file.user_id].user_id.firstname, 30, x, 350)
                            }
                            if (file.signature) {
                                //Date Signature 390 253 577-390
                                ctx.font = '20px Arial'
                                ctx.fillText(heureFormat(file.date_signature), 390, x, (577 - 390))
                                //Signature 585 253 793-585
                                let img = new Canvas.Image()
                                img.src = "storage/signature/" + file._id + ".png"
                                ctx.drawImage(img, 583, x - 23, (793 - 583), 50)
                            }
                            //+0 +30 max 1034

                            if (x == 1034 || x > 1034) {
                                ctx.addPage()
                                ctx.drawImage(bg, 0, 0)
                                ctx.font = '20px Arial'
                                ctx.fillText(formateur.lastname + " " + formateur.firstname, 131, 88, (414 - 131))
                                //Date 85 130 412-85 
                                ctx.fillText(dateFormat(seance.date_debut), 85, 130, (412 - 85))
                                //Heure 488 130
                                ctx.fillText(heureFormat(seance.date_debut), 488, 130, (412 - 85))
                                x = 253 - 57
                            }
                            x += 57
                        }

                    })


                    ctx.addPage()

                    const buff = canvas.toBuffer('application/pdf', {
                        title: 'Feuille de présence',
                        author: 'ESTYA',
                        subject: 'Feuille de présence du ' + dateFormat(seance.date_debut),
                        modDate: new Date()
                    })
                    fs.writeFileSync("storage/" + pdfName, buff, function (err) {
                        if (err) {
                            console.error(err)
                        }
                    })
                    let base64PDF = fs.readFileSync("storage/" + pdfName, { encoding: 'base64' }, (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                    res.status(200).send({ file: base64PDF })
                }).catch((error) => {
                    console.error(error)
                    res.status(500).send(error);
                })
            }).catch((error) => {
                console.error(error)
                res.status(500).send(error);
            })

        }).catch((error) => {
            console.error(error)
            res.status(500).send(error);
        })

    }).catch((error) => {
        console.error(error)
        res.status(500).send(error);
    })
});

app.get("/getJustificatif/:id", (req, res) => {
    Presence.findOne({ _id: req.params.id, justificatif: true }).then((data) => {
        //Find the type of the file
        var files = fs.readdirSync("storage/justificatif/");
        const img = ['jpeg', 'png', 'img', 'jpg'];
        const appli = ['pdf'];
        files.forEach(file => {
            let fileType = "";
            if (file.includes(req.params.id)) {
                let ext = file.split('.').pop().replace('.', '')
                let data_file = fs.readFileSync("storage/justificatif/" + req.params.id + "." + ext, { encoding: 'base64' }, (err) => {
                    if (err) {
                        console.error(err)
                        res.status(404).send(error);
                    }
                });
                if (img.indexOf(ext.toLowerCase()) > -1) {
                    fileType = "image/" + ext;
                } else if (appli.indexOf(ext.toLowerCase()) > -1) {
                    fileType = "application/" + ext
                } else {
                    fileType = "Error Ask for adding: " + ext
                }
                res.status(200).send({ file: data_file, fileType, fileName: req.params.id + "." + ext })
            }
        });


    }).catch((error) => {
        console.error(error)
        res.status(404).send(error);
    })
})


app.get("/getAllAbsences/:user_id", (req, res) => {
    Presence.find({ user_id: req.params.user_id, isPresent: false }).then(result => {
        res.status(201).send(result.length > 0 ? result : [])
    })
})

app.get("/updateAbsences/:user_id/:type", (req, res) => {
    Etudiant.findOne({ user_id: req.params.user_id }).populate('user_id').populate('classe_id').then(etudiant => {
        Presence.find({ user_id: req.params.user_id }).then(presences => {
            let listIDSeances = []
            presences.forEach(presence => {
                listIDSeances.push(presence.seance_id)
            })
            Seance.find({ _id: { $nin: listIDSeances }, classe_id: { $in: [etudiant.classe_id._id] }, date_debut: { $gte: new Date("2023-1-1"), $lt: new Date() }, isOptionnel: false }).then(seances => {
                if (req.params.type != "Agent")
                    res.status(200).send([])
                else
                    res.status(200).send(seances)
                seances.forEach((seance, index) => {
                    let p = new Presence({
                        seance_id: seance._id,
                        user_id: req.params.user_id,
                        isPresent: false,
                        signature: false,
                        justificatif: false,
                        date_signature: null,
                        allowedByFormateur: false,
                        PresentielOrDistanciel: null
                    })
                    p.save().then(doc => {
                        console.log(doc)
                    })
                })
            })
        })
    })
})

app.get('/getAllByUserIDMois/:user_id/:mois/:year', (req, res) => {
    Formateur.find({ user_id: req.params.user_id }).populate('user_id').then(formateur => {
        Presence.find({ user_id: req.params.user_id }).populate({ path: 'seance_id', populate: { path: 'classe_id' } }).populate({ path: 'seance_id', populate: { path: 'matiere_id' } }).then(presences => {
            let r = []
            let idSeance = []
            //631885ab09f35173347bab70 -> f_id ; 631885ab09f35173347bab71 -> ??
            let formateur_id = req.params.user_id
            let total = 0
            //{seance.libelle,classes.abbrv,matiere_id.nom,date_debut,presence,calcul}
            presences.forEach(p => {
                if (p.seance_id) {
                    let date_fin = new Date(p?.seance_id?.date_fin)
                    let date_debut = new Date(p?.seance_id?.date_debut)
                    let totalHeure = 0
                    let classes = ""
                    if (date_debut.getMonth() + 1 == parseInt(req.params.mois) && date_debut.getFullYear() == parseInt(req.params.year)) {
                        totalHeure += date_fin.getHours() - date_debut.getHours()
                        p.seance_id.classe_id.forEach(c => {
                            classes = classes + c.abbrv
                        })
                        if ((date_fin.getMinutes() == 30 && date_debut.getMinutes() != 30) || (date_fin.getMinutes() != 30 && date_debut.getMinutes() == 30))
                            totalHeure = totalHeure + 0.5
                        let d = { libelle: p.seance_id.libelle, classes, matiere: p.seance_id.matiere_id.nom, date_debut, presence: 'Présent', calcul: totalHeure, matin: date_debut.getHours() < 12 ? "Matin" : 'Après-Midi', taux_h: 0 }
                        if (formateur?.coutHbyModule && formateur?.coutHbyModule[p.seance_id.matiere_id._id])
                            d.taux_h = formateur?.coutHbyModule[p.seance_id.matiere_id._id]
                        r.push(d)
                        idSeance.push(p.seance_id._id)
                        total += totalHeure
                    }
                }
            })
            Seance.find({ formateur_id: formateur_id, _id: { $nin: idSeance } }).populate('classe_id').populate('matiere_id').then(seances => {
                seances.forEach(s => {
                    let date_fin = new Date(s.date_fin)
                    let date_debut = new Date(s.date_debut)
                    let totalHeure = 0
                    let classes = ""
                    if (date_debut.getMonth() + 1 == parseInt(req.params.mois) && date_debut.getFullYear() == parseInt(req.params.year)) {
                        totalHeure += date_fin.getHours() - date_debut.getHours()
                        if ((date_fin.getMinutes() == 30 && date_debut.getMinutes() != 30) || (date_fin.getMinutes() != 30 && date_debut.getMinutes() == 30))
                            totalHeure = totalHeure + 0.5
                        s.classe_id.forEach(c => {
                            classes = classes + c.abbrv
                        })
                        let d = { libelle: s.libelle, classes, matiere: s.matiere_id.nom, date_debut, presence: 'Absent', calcul: totalHeure, matin: date_debut.getHours() < 12 ? "Matin" : 'Après-Midi', taux_h: 0 }
                        if (formateur?.coutHbyModule && formateur?.coutHbyModule[s.matiere_id._id])
                            d.taux_h = formateur?.coutHbyModule[s.matiere_id._id]
                        r.push(d)
                    }

                })
                r.push({ libelle: 'TOTAL Présent', classe: '', matiere: '', date_debut: '', presence: '', calcul: total, matin: "" })
                res.status(201).send(r)
            })
        })
    })

})

app.post('/updatePresence', (req, res) => {
    Presence.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        Presence.findById(doc._id).populate("seance_id").then(docExport => {
            res.send(docExport)
        })
    })
})
module.exports = app;
