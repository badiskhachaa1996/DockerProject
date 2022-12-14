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
app.get("/getAllByUser/:id", (req, res) => {

    Presence.find({
        user_id: req.params.id,
    }).populate("seance_id").then((data) => {


        res.status(200).send(data);
    }).catch((error) => {
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


app.post("/getAssiduitePDF/:id", (req, res) => {

    let rangDate = req.body

    let dataTosend = [];
    let etudiantData;
    const pdfName = 'Ass_' + req.params.id + ".pdf"
    function pad(s) { return (s < 10) ? '0' + s : s; }
    function dateFormat(inputFormat) {
        var d = new Date(inputFormat)
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
    }
    function heureFormat(input) {
        var d = new Date(input)
        return [pad(d.getHours()), pad(d.getMinutes())].join(':')
    }
    Etudiant.findOne({ user_id: req.params.id }).populate({
        path: 'user_id', populate: {
            path: "entreprise"
        }
    }).populate('classe_id').populate({
        path: 'formateur_id', populate: {
            path: "user_id"
        }
    }).then((data) => {
        etudiantData = data



        Presence.find({
            user_id: req.params.id,
        }).populate({ path: "seance_id", populate: { path: 'formateur_id', populate: { path: 'user_id' } } }).then((data) => {

            const canvas = Canvas.createCanvas(2300, 1500, 'pdf')
            const ctx = canvas.getContext('2d')
            const bg = new Canvas.Image()
            bg.src = "assets/model_assiduite.png"
            ctx.drawImage(bg, 0, 0)
            ctx.font = '30px Arial';
            xi = 0;
            yi = 0;
            xif = 0;
            yif = 0;
            const signForImage = new Canvas.Image()
            const signImage = new Canvas.Image()
            ctx.fillText(etudiantData.classe_id.nom, 400, 368, (414 - 131));
            ctx.fillText((etudiantData?.entreprise ? etudiantData?.entreprise : '--'), 400, 420, (414 - 131));
            data.forEach(seance => {

                if (new Date(rangDate[0]) <= new Date(seance.seance_id.date_debut.toISOString().split('T')[0]) && new Date(seance.seance_id.date_debut.toISOString().split('T')[0]) <= new Date(rangDate[1])) {
                    dataTosend.push(seance)

                    ctx.fillText(dateFormat(new Date(seance.seance_id.date_debut.toISOString().split('T')[0])), 460, 730 + yi, (414 - 131));

                    ctx.fillText(etudiantData.user_id.firstname + ' ' + etudiantData.user_id.lastname, 50, 730 + yi, (414 - 131));
                    if (new Date(seance.seance_id.date_debut).getHours() < 13) {
                        if (seance.isPresent) {

                            signImage.src = "storage/signature/" + seance._id + ".png";
                            ctx.drawImage(signImage, 655, 665 + yi, (680 - 332), 50)
                        }
                        else {
                            ctx.fillStyle = 'red';
                            ctx.fillText(' ABSENT ', 670, 705 + yi, (414 - 131));
                            ctx.fillStyle = 'black';
                        }
                    }
                    else {

                        if (seance.isPresent) {

                            const signImage = new Canvas.Image()
                            signImage.src = "storage/signature/" + seance._id + ".png";
                            ctx.drawImage(signImage, 990, 665 + yi, (680 - 332), 50)
                        }
                        else {
                            ctx.fillStyle = 'red';
                            ctx.fillText(' ABSENT ', 980, 705 + yi, (414 - 131));
                            ctx.fillStyle = 'black';
                        }
                    }

                    ctx.fillText(seance.seance_id.formateur_id.user_id.firstname + " " + seance.seance_id.formateur_id.user_id.lastname, 1325, 730 + yi, (414 - 131));


                    Presence.find({ seance_id: seance.seance_id._id, user_id: seance.seance_id.formateur_id.user_id._id }).then(
                        async dataForPresData => {
                            dataForPres = dataForPresData

                            if (dataForPres[0]) {

                                let srx = "storage/signature/" + dataForPres[0]._id + ".png"

                                signForImage.src = srx;
                                ctx.drawImage(signForImage, 1648, 670 + yif, (680 - 332), 50);

                            }

                            yif = await yif + 81;
                        })



                    yi = yi + 81;
                    if (yi == 810 || yi > 810) {
                        ctx.addPage()
                        ctx.drawImage(bg, 0, 0)
                        yi = 0

                        ctx.fillText(etudiantData.classe_id.nom, 400, 368, (414 - 131));
                        ctx.fillText((etudiantData?.entreprise ? etudiantData?.entreprise : '--'), 400, 420, (414 - 131));

                    }
                }

            })
            setTimeout(function () {



                console.log("etape executé")
                ctx.addPage()

                const buff = canvas.toBuffer('application/pdf', {
                    title: 'Recap Assiduite ',
                    author: 'ESTYA',
                    subject: 'Feuille de présence du ' + dateFormat('20/10/2020'),
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
            }, 2000);
        })
    }).catch((error) => {
        console.error(error)
        res.status(500).send(error);
    })
});

app.post("/getAtt_ssiduitePDF/:id", (req, res) => {
    console.log(req.params.id)
    etudiantData: Etudiant;
    const pdfName = 'Att_assiduite' + req.params.id + ".pdf"

    function pad(s) { return (s < 10) ? '0' + s : s; }
    function dateFormat(inputFormat) {
        var d = new Date(inputFormat)
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
    }
    function heureFormat(input) {
        var d = new Date(input)
        return [pad(d.getHours()), pad(d.getMinutes())].join(':')
    }
    //Récupérer tous les presence d'une séance

    Etudiant.findOne({ _id: req.params.id }).populate({
        path: 'user_id',
    }).populate({
        path: 'classe_id', populate: { path: 'diplome_id' }
    }).then((data) => {
        etudiantData = data
        const canvas = Canvas.createCanvas(753, 911, 'pdf')
        const ctx = canvas.getContext('2d')
        const bg = new Canvas.Image()
        bg.src = "assets/attestation_assiduite.png"
        ctx.drawImage(bg, 0, 0)
        ctx.font = '20px Arial';
        xi = 0;
        yi = 0;
        xif = 0;
        yif = 0;


        ctx.fillText(etudiantData.user_id.civilite + " " + etudiantData.user_id.firstname + " " + etudiantData.user_id.lastname, 230, 400, (214 - 71));
        ctx.fillText(etudiantData.classe_id.diplome_id.titre_long, 200, 540, (214 - 71));
        ctx.fillText(dateFormat(etudiantData.classe_id.diplome_id.date_debut), 163, 612, (214 - 71));
        ctx.fillText(dateFormat(Date.now()), 414, 612, (214 - 71));
        ctx.addPage()

        const buff = canvas.toBuffer('application/pdf', {
            title: 'Attestation Assiduite ',
            author: 'IMS',
            subject: 'Attestation assiduité ',
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
    });
});
//Mets un étudiant en présent
app.post("/isPresent/:id", (req, res) => {
    Presence.findByIdAndUpdate(req.params.id,
        {
            isPresent: req.body.isPresent,
            allowedByFormateur: req.body.isPresent
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
    presence.save((err, data) => {
        //Sauvegarde de la signature si il y en a une
        if (err) {
            console.error(err)
            res.send(err)
        } else {
            res.send(data);
        }
        console.log(req.body.signature)
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

app.get('/getAllByUserIDMois/:user_id/:mois', (req, res) => {
    Presence.find({ user_id: req.params.user_id }).populate({ path: 'seance_id', populate: { path: 'classe_id' } }).populate({ path: 'seance_id', populate: { path: 'matiere_id' } }).then(presences => {
        let r = []
        let idSeance = []
        //631885ab09f35173347bab70 -> f_id ; 631885ab09f35173347bab71 -> ??
        let formateur_id = req.params.user_id
        let total = 0
        //{seance.libelle,classes.abbrv,matiere_id.nom,date_debut,presence,calcul}
        presences.forEach(p => {
            let date_fin = new Date(p.seance_id.date_fin)
            let date_debut = new Date(p.seance_id.date_debut)
            let totalHeure = 0
            let classes = ""
            if (date_debut.getMonth() + 1 == parseInt(req.params.mois)) {
                totalHeure += date_fin.getHours() - date_debut.getHours()
                p.seance_id.classe_id.forEach(c=>{
                    classes = classes + c.abbrv
                })
                if ((date_fin.getMinutes() == 30 && date_debut.getMinutes() != 30) || (date_fin.getMinutes() != 30 && date_debut.getMinutes() == 30))
                    totalHeure = totalHeure + 0.5
                r.push({ libelle: p.seance_id.libelle, classes, matiere: p.seance_id.matiere_id.nom, date_debut, presence: 'Présent', calcul: totalHeure, matin: date_debut.getHours() < 12 ? "Matin" : 'Après-Midi' })
                idSeance.push(p.seance_id._id)
                total += totalHeure
            }
        })
        Seance.find({ formateur_id: formateur_id, _id: { $nin: idSeance } }).populate('classe_id').populate('matiere_id').then(seances => {
            seances.forEach(s => {
                let date_fin = new Date(s.date_fin)
                let date_debut = new Date(s.date_debut)
                let totalHeure = 0
                let classes = ""
                if (date_debut.getMonth() + 1 == parseInt(req.params.mois)) {
                    totalHeure += date_fin.getHours() - date_debut.getHours()
                    if ((date_fin.getMinutes() == 30 && date_debut.getMinutes() != 30) || (date_fin.getMinutes() != 30 && date_debut.getMinutes() == 30))
                        totalHeure = totalHeure + 0.5
                    s.classe_id.forEach(c=>{
                        classes = classes + c.abbrv
                    })
                    r.push({ libelle: s.libelle, classes, matiere: s.matiere_id.nom, date_debut, presence: 'Absent', calcul: totalHeure, matin: date_debut.getHours() < 12 ? "Matin" : 'Après-Midi' })
                }

            })
            r.push({ libelle: 'TOTAL Présent', classe: '', matiere: '', date_debut: '', presence: '', calcul: total, matin: "" })
            res.status(201).send(r)
        })
    })
})
module.exports = app;
