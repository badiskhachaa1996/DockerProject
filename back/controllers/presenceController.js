const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Presence } = require("./../models/presence");
var fs = require('fs')
var Canvas = require('canvas');
const { User } = require("../models/user");
const { Seance } = require("../models/seance");

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
    Presence.find({ user_id: req.params.id }).then((data) => {
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

//Mets un étudiant en présent
app.get("/isPresent/:id", (req, res) => {
    Presence.findOneAndUpdate({ _id: req.params.id },
        {
            isPresent: true
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
        date_signature: Date.now()
    });
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
});

//Mets un étudiant en présent
app.post("/addSignature/:id", (req, res) => {
    Presence.findOneAndUpdate(req.params.id,
        {
            signature: true,
            isPresent: true,
            date_signature: Date.now()
        }, { new: true }, (err, data) => {
            if (err) {
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
    
    Presence.findOneAndUpdate({ user_id: req.params.user_id,seance_id:req.params.seance_id },
        {
            justificatif: true
        }, { new: true }, (err, data) => {
            if (err) {
                res.send(err)
            }
            else {
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

app.get("/getPDF/:id", (req, res) => {
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
                User.find().then(userList => {
                    let UserDic = [];
                    userList.forEach(user => {
                        UserDic[user._id] = user
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
                    ctx.fillText(heureFormat(seance.date_debut)+" - "+heureFormat(seance.date_fin), 488, 130, (412 - 85))
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
                                ctx.fillText(UserDic[file.user_id].lastname + " " + UserDic[file.user_id].firstname, 30, x, 350)
                            }
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
                            x=253-57
                        }
                        x += 57
                    })


                    ctx.addPage()

                    const buff = canvas.toBuffer('application/pdf', {
                        title: 'Feuille de présence',
                        author: 'ESTYA',
                        subject: 'Feuille de présence du ' + dateFormat(seance.date_debut),
                        modDate: new Date()
                    })
                    fs.writeFileSync("storage/"+pdfName, buff, function (err) {
                        if (err) {
                            console.error(err)
                        }
                    })
                    let base64PDF = fs.readFileSync("storage/"+pdfName, { encoding: 'base64' }, (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                    res.status(200).send({file:base64PDF})
                }).catch((error) => {
                    res.status(500).send(error);
                })
            }).catch((error) => {
                res.status(500).send(error);
            })

        }).catch((error) => {
            res.status(500).send(error);
        })

    }).catch((error) => {
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

module.exports = app;
